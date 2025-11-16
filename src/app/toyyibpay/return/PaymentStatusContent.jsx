"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Loader2, XCircle } from "lucide-react";
import { exportToPdfServer } from "@/services/pdfExport";

export default function PaymentStatusContent() {
  const sp = useSearchParams();
  // ToyyibPay may return billcode (lowercase) or BillCode. Support all.
  const billCode =
    sp?.get("billCode") || sp?.get("BillCode") || sp?.get("billcode") || "";
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!billCode) {
      setStatus("missing");
      return;
    }
    let cancelled = false;
    const poll = async () => {
      try {
        const fd = new FormData();
        fd.set("billCode", billCode);
        const res = await fetch(`/api/toyyibpay/status`, {
          method: "POST",
          body: fd,
        });
        const json = await res.json();
        if (cancelled) return;
        if (json.paid) {
          setStatus("paid");
          setTransactions(json.transactions || []);
          setIsDownloading(true);
          // Trigger automatic download once paid
          try {
            const filename =
              localStorage.getItem("resume:filename") || "resume.pdf";
            const data = localStorage.getItem("resume:data");

            await exportToPdfServer({
              html: data,
              filename: filename,
              billCode,
            });
          } catch (e) {
            console.warn("Auto-download after payment failed", e);
          }
          setIsDownloading(false);
        } else {
          setStatus("pending");
          setTransactions(json.transactions || []);
          setTimeout(poll, 3000); // poll every 3s until paid
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setStatus("error");
        }
      }
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [billCode]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const filename = localStorage.getItem("resume:filename") || "resume.pdf";
      const data = localStorage.getItem("resume:data");
      await exportToPdfServer({
        html: data,
        filename: filename,
        billCode,
      });
    } catch (e) {
      console.error("Manual download failed", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="text-slate-700 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        {!billCode && (
          <div className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Missing billCode in query.
          </div>
        )}
        {status === "checking" && (
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking payment…
          </div>
        )}
        {status === "pending" && (
          <div className="flex items-center gap-2 text-amber-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Waiting for payment confirmation…
          </div>
        )}
        {status === "paid" && (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
            Payment received! You can now download your PDF.
          </div>
        )}
        {status === "error" && (
          <div className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Error: {error}
          </div>
        )}
        <div className="mt-6 space-y-3 text-sm">
          <div>
            <strong>Bill Code:</strong> {billCode || "—"}
          </div>
          {transactions.length > 0 && (
            <div className="max-h-40 overflow-auto border rounded p-2 bg-slate-50">
              {transactions.map((t, i) => (
                <div key={i} className="py-1 border-b last:border-b-0">
                  <div>
                    <strong>Status:</strong>{" "}
                    {t.billpaymentStatus
                      ? t.billpaymentStatus === "1"
                        ? "Successful"
                        : t.billpaymentStatus === "2"
                        ? "Pending Transaction"
                        : t.billpaymentStatus === "3"
                        ? "Unsuccessful Transaction"
                        : t.billpaymentStatus === "4"
                        ? "Pending"
                        : "Unknown"
                      : "—"}
                  </div>
                  <div>
                    <strong>Amount:</strong> MYR{" "}
                    {t.billpaymentAmount ? t.billpaymentAmount : "—"}
                  </div>
                  <div>
                    <strong>Paid Date:</strong>{" "}
                    {
                      //handle so date is more readable
                      t.billPaymentDate ? t.billPaymentDate : "—"
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {status === "paid" && (
          <>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`${
                  isDownloading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-emerald-700"
                } w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold text-center`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Download Resume</span>
                    </>
                  )}
                </span>
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="/"
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700"
              >
                Back to Builder
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
