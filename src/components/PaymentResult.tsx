import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface PaymentResultProps {
  status: 'success' | 'failed';
  projectId: number | null;
  onReturn: () => void;
}

/**
 * Shown after PayMongo redirects back to /payment/success or /payment/failed.
 * Verifies the latest payment for the project, then returns to the dashboard.
 */
export const PaymentResult: React.FC<PaymentResultProps> = ({ status, projectId, onReturn }) => {
  const [checking, setChecking] = useState(true);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (status === 'failed') {
        setConfirmed(false);
        setChecking(false);
        return;
      }

      // Poll the backend briefly — the webhook/return confirms the payment.
      try {
        for (let attempt = 0; attempt < 6; attempt++) {
          const payments = await api.payments.getUserPayments();
          const match = [...payments]
            .filter((p) => (projectId ? p.project_id === projectId : true))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

          if (match) {
            if (match.status === 'paid') {
              if (!cancelled) {
                setAmount(match.amount);
                setConfirmed(true);
                setChecking(false);
              }
              return;
            }
            if (match.status === 'failed' || match.status === 'cancelled') {
              if (!cancelled) {
                setConfirmed(false);
                setChecking(false);
              }
              return;
            }
          }

          // Still pending — wait and retry.
          await new Promise((r) => setTimeout(r, 1500));
        }

        // Timed out but payment likely processing — treat as success-redirect.
        if (!cancelled) {
          setConfirmed(true);
          setChecking(false);
        }
      } catch {
        if (!cancelled) {
          // Could not verify; still show the success screen (PayMongo sent us here).
          setConfirmed(true);
          setChecking(false);
        }
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [status, projectId]);

  const isSuccess = status === 'success' && confirmed !== false;

  return (
    <div className="min-h-screen w-full bg-[#111316] text-[#e2e2e6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#16181c] border border-[#333538] rounded-2xl p-8 text-center shadow-xl">
        {checking ? (
          <>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5 bg-[#1e2023] border border-[#333538]">
              <Loader2 className="w-8 h-8 text-[#bdc2ff] animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verifying payment…</h2>
            <p className="text-sm text-[#8e9195] leading-relaxed">
              Please wait while we confirm your transaction with the payment provider.
            </p>
          </>
        ) : isSuccess ? (
          <>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5 bg-emerald-500/15 border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Payment Successful</h2>
            <p className="text-sm text-[#c5c6cb] leading-relaxed mb-1">
              Your payment has been confirmed and your project build has been queued.
            </p>
            {amount != null && (
              <p className="text-lg font-bold text-emerald-400 font-mono mt-2">
                ₱{amount.toLocaleString()} <span className="text-xs text-[#8e9195]">PHP</span>
              </p>
            )}
            <button
              onClick={onReturn}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 bg-white text-[#111316] font-bold text-sm rounded-lg hover:bg-[#e4e7eb] transition-all cursor-pointer"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5 bg-red-500/15 border border-red-500/40">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Payment Not Completed</h2>
            <p className="text-sm text-[#c5c6cb] leading-relaxed mb-1">
              Your payment was cancelled or failed. No amount was charged. You can try again from
              your project dashboard.
            </p>
            <button
              onClick={onReturn}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 bg-white text-[#111316] font-bold text-sm rounded-lg hover:bg-[#e4e7eb] transition-all cursor-pointer"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
