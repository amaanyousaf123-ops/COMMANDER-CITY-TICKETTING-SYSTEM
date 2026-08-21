'use client';

import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, BadgeCheck } from 'lucide-react';
import { verifyEmployeeId, verifyPassNumber, saveUserProfile } from '@/lib/storage';
import { UserProfile, PassengerCategory } from '@/types/shuttle';

interface EmployeePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const EmployeePassModal: React.FC<EmployeePassModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'EMPLOYEE' | 'PASS_HOLDER'>('EMPLOYEE');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idInput, setIdInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (tab === 'EMPLOYEE') {
      const v = verifyEmployeeId(idInput);
      if (!v.valid) {
        setError(v.message);
        return;
      }
      const profile: UserProfile = {
        name: name.trim(),
        phone: phone.trim(),
        category: 'EMPLOYEE',
        employeeId: v.empFormatted,
        verifiedAt: new Date().toISOString(),
      };
      saveUserProfile(profile);
      onSuccess(profile);
      onClose();
    } else {
      const v = verifyPassNumber(idInput);
      if (!v.valid) {
        setError(v.message);
        return;
      }
      const profile: UserProfile = {
        name: name.trim(),
        phone: phone.trim(),
        category: 'PASS_HOLDER',
        passNumber: v.passFormatted,
        verifiedAt: new Date().toISOString(),
      };
      saveUserProfile(profile);
      onSuccess(profile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Employee & Pass Portal</h3>
              <p className="text-xs text-slate-400">Verify monthly pass or staff card</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 font-semibold text-xs border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setTab('EMPLOYEE'); setError(null); }}
            className={`py-2.5 rounded-lg transition-all ${
              tab === 'EMPLOYEE' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Society Staff / Employee
          </button>
          <button
            type="button"
            onClick={() => { setTab('PASS_HOLDER'); setError(null); }}
            className={`py-2.5 rounded-lg transition-all ${
              tab === 'PASS_HOLDER' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Pass Holder
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Tariq Mehmood"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Phone Number *
            </label>
            <input
              type="tel"
              placeholder="e.g. 03331234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {tab === 'EMPLOYEE' ? 'Employee Card ID Number *' : 'Current Monthly Pass Number *'}
            </label>
            <input
              type="text"
              placeholder={tab === 'EMPLOYEE' ? 'e.g. EMP-9021' : 'e.g. PASS-AUG26-8812'}
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              {tab === 'EMPLOYEE'
                ? 'Society staff ticket fare: 250 PKR/trip'
                : 'Monthly pass holders travel with 0 PKR add-on fare! Passes reset monthly.'}
            </p>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-600/20 transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <BadgeCheck className="w-4 h-4" />
              <span>Verify & Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
