"use client";

import { Suspense } from "react";
import { Loader2, Shield, CreditCard } from "lucide-react";
import PaymentStatusContent from "./PaymentStatusContent";

function PaymentStatusFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-md w-full border border-white/20 animate-in fade-in duration-500">
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Payment Verification
          </h1>
          <p className="text-slate-600 mb-6 text-sm leading-relaxed">
            We're securely processing your payment information. This will just take a moment...
          </p>
          
          {/* Animated Loader */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-ping"></div>
            </div>
            <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Processing securely...
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/50">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="w-3 h-3 text-emerald-500" />
            Secured with bank-level encryption • 100% Safe
          </div>
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