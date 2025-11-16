import { Download, X } from "lucide-react";

export default function CustomerFormModal({
  setShowBuyerModal,
  buyerName,
  setBuyerName,
  buyerEmail,
  setBuyerEmail,
  buyerPhone,
  setBuyerPhone,
  buyerError,
  handleCreateBill,
  isProcessing,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Buyer Information</h2>
            <button
              onClick={() => setShowBuyerModal(false)}
              className="hover:bg-blue-700 p-1 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-50">We need this for the ToyyibPay bill</p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="text-slate-700 w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Afiq Kyrol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="text-slate-700 w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="text-slate-700 w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 0123456789"
              />
            </div>
            {buyerError && (
              <div className="text-sm text-red-600">{buyerError}</div>
            )}
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={handleCreateBill}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Bill…</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Continue to Payment</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowBuyerModal(false)}
              disabled={isProcessing}
              className="w-full border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-center text-slate-500 mt-6">
            We respect your privacy and only use this info for the bill.
          </p>
        </div>
      </div>
    </div>
  );
}
