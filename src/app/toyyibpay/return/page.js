import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentStatusContent from "./PaymentStatusContent";

function PaymentStatusFallback() {
  return (
    <div className="text-slate-700 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading payment information…
        </div>
      </div>
    </div>
  );
}

export default function ToyyibPayReturnPage() {
  return (
    <Suspense fallback={<PaymentStatusFallback />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
