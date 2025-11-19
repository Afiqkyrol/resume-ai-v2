"use client";

import { Download, Lock, X, Sparkles, CheckCircle, Shield } from "lucide-react";

export default function PaymentModal({
  setShowPaymentModal,
  handleConfirmPayment,
  isProcessing,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Margin top added here to shift modal downward */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-200 mt-16">
        
        {/* HEADER WITH GRADIENT */}
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 p-5 text-white relative overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute top-2 right-2 opacity-20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-2 left-2 opacity-20">
            <Download className="w-5 h-5" />
          </div>
          
          <div className="flex items-center justify-between mb-1 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Download className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Premium Resume</h2>
                <p className="text-emerald-50 text-xs font-medium">Secure PDF Export</p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="hover:bg-white/20 p-1.5 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 bg-gradient-to-b from-white to-slate-50">

          {/* Secure Download Card */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1">
                  Secure Download
                  <Shield className="w-3 h-3 text-emerald-500" />
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get your professionally formatted resume in high-quality PDF. 
                  Payment is secure and instant.
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { text: "A4 Perfect", color: "text-blue-500" },
              { text: "ATS Friendly", color: "text-emerald-500" },
              { text: "High Quality", color: "text-purple-500" },
              { text: "Instant", color: "text-amber-500" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2 py-1.5">
                <CheckCircle className={`w-3 h-3 ${feature.color}`} />
                <span className="text-xs font-medium text-slate-700">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Price Card */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 mb-5 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-700 text-sm font-semibold">
                Download Fee
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  RM2
                </span>
                <span className="text-slate-500 text-xs font-medium">one-time</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Includes professional PDF with lifetime access
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Pay & Download Now</span>
                  <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              disabled={isProcessing}
              className="w-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              Maybe Later
            </button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-200">
            <Shield className="w-3 h-3 text-emerald-500" />
            <p className="text-[10px] text-slate-500 font-medium">
              Secured with enterprise-grade encryption • 100% Safe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}