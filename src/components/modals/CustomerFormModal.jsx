"use client";

import { Download, Lock, X, Sparkles, CheckCircle, Shield, User, Mail, Phone } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 mt-[25px]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200 mt-10">
        
        {/* HEADER WITH GRADIENT */}
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 p-4 text-white relative overflow-hidden">
          <div className="flex items-center justify-between mb-1 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold">Contact Details</h2>
                <p className="text-emerald-50 text-xs">Secure Information</p>
              </div>
            </div>
            <button
              onClick={() => setShowBuyerModal(false)}
              className="hover:bg-white/20 p-1 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTENT - Compact */}
        <div className="p-4 bg-gradient-to-b from-white to-slate-50">

          {/* Secure Information Card - Smaller */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-lg p-3 mb-3 border border-emerald-100">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Secure Information</h3>
                <p className="text-xs text-slate-600">
                  Your details are encrypted and only used for payment verification.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields - Compact */}
          <div className="space-y-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="text-slate-700 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Afiq Kyrol"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="text-slate-700 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="text-slate-700 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 0123456789"
              />
            </div>
          </div>

          {/* Icons Only Features - Very Compact */}
          <div className="flex justify-center gap-4 mb-3">
            <Shield className="w-4 h-4 text-blue-500" />
            <Lock className="w-4 h-4 text-emerald-500" />
            <Sparkles className="w-4 h-4 text-purple-500" />
            <CheckCircle className="w-4 h-4 text-amber-500" />
          </div>

          {/* Action Buttons - Compact */}
          <div className="space-y-2">
            <button
              onClick={handleCreateBill}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Bill...</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>Continue to Payment</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowBuyerModal(false)}
              disabled={isProcessing}
              className="w-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          {/* Security Badge - Compact */}
          <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-slate-200">
            <Shield className="w-3 h-3 text-emerald-500" />
            <p className="text-[10px] text-slate-500">Secured with encryption • 100% Safe</p>
          </div>
        </div>
      </div>
    </div>
  );
}