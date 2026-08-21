'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Smartphone, Copy, Check, ArrowRight, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';

interface EasyPaisaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  passengerName: string;
  category: string;
  timeSlot: string;
  routeLabel: string;
  onPaymentSuccess: (trxId: string) => void;
}

export const EasyPaisaPaymentModal: React.FC<EasyPaisaPaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  passengerName,
  category,
  timeSlot,
  routeLabel,
  onPaymentSuccess,
}) => {
  const [paymentMode, setPaymentMode] = useState<'DIRECT_APP' | 'TRX_ID'>('DIRECT_APP');
  const [mobileNumber, setMobileNumber] = useState('');
  const [trxIdInput, setTrxIdInput] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'DETAILS' | 'PIN' | 'SUCCESS'>('DETAILS');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const EASYPAISA_NUMBER = '0300-9876543';
  const EASYPAISA_TITLE = 'CDR City Shuttle Services';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('03009876543');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleInitiateWalletPay = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 11-digit EasyPaisa mobile number.');
      return;
    }
    setStep('PIN');
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setError('Please enter your 5-digit EasyPaisa Secret PIN.');
      return;
    }
    setProcessing(true);
    setError(null);

    setTimeout(() => {
      setProcessing(false);
      const generatedTrx = `EP-${Math.floor(10000000000 + Math.random() * 90000000000)}`;
      onPaymentSuccess(generatedTrx);
      onClose();
    }, 1800);
  };

  const handleConfirmTrxId = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanTrx = trxIdInput.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 6) {
      setError('Please enter a valid EasyPaisa Transaction ID (TRX ID).');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess(cleanTrx);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* EasyPaisa Top Branding Header */}
        <div className="bg-[#00A651] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-white text-[#00A651] rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">
                e
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight">EasyPaisa Payment</h3>
                <p className="text-xs text-emerald-100 font-medium">Official Online Checkout</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="mt-4 bg-emerald-800/40 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center justify-between text-white">
            <div>
              <p className="text-[11px] text-emerald-100">Total Payable Amount</p>
              <p className="text-xl font-extrabold tracking-tight">PKR {amount}</p>
            </div>
            <div className="text-right">
              <span className="bg-white text-[#00A651] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {category} Rate
              </span>
              <p className="text-[10px] text-emerald-100 mt-1">{routeLabel}</p>
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          {step === 'DETAILS' && (
            <>
              {/* Payment Mode Selection */}
              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setPaymentMode('DIRECT_APP'); setError(null); }}
                  className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                    paymentMode === 'DIRECT_APP' ? 'bg-white text-[#00A651] shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>EasyPaisa Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMode('TRX_ID'); setError(null); }}
                  className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                    paymentMode === 'TRX_ID' ? 'bg-white text-[#00A651] shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Transfer / TRX ID</span>
                </button>
              </div>

              {paymentMode === 'DIRECT_APP' ? (
                <form onSubmit={handleInitiateWalletPay} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your EasyPaisa Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="03001234567"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:outline-none"
                        required
                      />
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      You will receive an instant payment request prompt on your EasyPaisa app.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-bold text-white bg-[#00A651] hover:bg-[#008f45] rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to EasyPaisa Mobile Approval</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmTrxId} className="space-y-4 pt-1">
                  {/* Account details box */}
                  <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Send Payment To:</span>
                      <span className="font-bold text-emerald-900">{EASYPAISA_TITLE}</span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200">
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">EasyPaisa Account</p>
                        <p className="text-sm font-mono font-bold text-emerald-800">{EASYPAISA_NUMBER}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="bg-emerald-100 hover:bg-emerald-200 text-[#00A651] px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter EasyPaisa Transaction ID (TRX ID) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 29384712093"
                      value={trxIdInput}
                      onChange={(e) => setTrxIdInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Found in the SMS confirmation from 3737 after sending payment.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 text-xs font-bold text-white bg-[#00A651] hover:bg-[#008f45] rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying EasyPaisa Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Confirm Ticket (PKR {amount})</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {step === 'PIN' && (
            <form onSubmit={handleConfirmPin} className="space-y-4 pt-1 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-[#00A651] rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">EasyPaisa Mobile PIN</h4>
                <p className="text-xs text-slate-500">
                  Sending PKR {amount} from {mobileNumber} to {EASYPAISA_TITLE}
                </p>
              </div>

              <div>
                <input
                  type="password"
                  maxLength={5}
                  placeholder="• • • • •"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-40 text-center tracking-[0.5em] text-lg font-bold py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#00A651] focus:outline-none mx-auto block"
                  autoFocus
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1.5">Enter 5-digit PIN to authorize payment</p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('DETAILS')}
                  className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-2/3 py-2.5 text-xs font-bold text-white bg-[#00A651] hover:bg-[#008f45] rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay PKR {amount} Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
