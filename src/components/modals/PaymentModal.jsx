import { Download, Lock, X } from "lucide-react";

export default function PaymentModal({
  setShowPaymentModal,
  handleConfirmPayment,
  isProcessing,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Download Resume</h2>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="hover:bg-emerald-700 p-1 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-emerald-50">Premium PDF Export</p>
        </div>

        <div className="p-8">
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Secure Download
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Get your professionally formatted resume in high-quality PDF.
                  Payment is secure and instant.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-slate-600 font-medium">Download Fee</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-emerald-600">RM2</span>
                <span className="text-slate-500 text-sm">one-time</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Includes high-quality PDF format
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Pay & Download</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowPaymentModal(false)}
              disabled={isProcessing}
              className="w-full border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-center text-slate-500 mt-6">
            Payment secured by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}
