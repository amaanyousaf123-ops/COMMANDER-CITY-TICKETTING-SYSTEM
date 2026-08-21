'use client';

import React, { useState } from 'react';
import { X, FileCheck, Upload, CheckCircle2, AlertCircle, ScanLine, ShieldCheck } from 'lucide-react';
import { verifyNOCDocument, saveUserProfile } from '@/lib/storage';
import { UserProfile } from '@/types/shuttle';

interface NocRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export const NocRegistrationModal: React.FC<NocRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nocInput, setNocInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto fill or extract NOC string simulation from filename/file
      setScanning(true);
      setError(null);

      setTimeout(() => {
        setScanning(false);
        const autoNoc = `NOC-CDR-${Math.floor(1000 + Math.random() * 9000)}`;
        setNocInput(autoNoc);
        setScanResult(`Scanned ${file.name}: Verified NOC format "${autoNoc}"`);
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full resident name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    const verification = verifyNOCDocument(nocInput);
    if (!verification.valid) {
      setError(verification.message);
      return;
    }

    const newProfile: UserProfile = {
      name: name.trim(),
      phone: phone.trim(),
      category: 'RESIDENT',
      nocNumber: verification.nocFormatted,
      verifiedAt: new Date().toISOString(),
    };

    saveUserProfile(newProfile);
    onSuccess(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Resident NOC Registration</h3>
              <p className="text-xs text-slate-400">Unlock Resident Rate (250 PKR/trip)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
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
              Resident Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Muhammad Usman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Phone Number *
            </label>
            <input
              type="tel"
              placeholder="e.g. 03001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* NOC Document Upload & Scanner Section */}
          <div className="border border-dashed border-emerald-300 bg-emerald-50/50 p-4 rounded-xl text-center">
            <p className="text-xs font-semibold text-emerald-900 mb-1 flex items-center justify-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Scan or Upload Housing Society NOC
            </p>
            <p className="text-[11px] text-emerald-700 mb-3">
              Upload photo of NOC certificate issued by CDR City Administration
            </p>

            <label className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all active:scale-95">
              <Upload className="w-4 h-4" />
              <span>{selectedFile ? 'Change NOC File' : 'Upload NOC Image / PDF'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {scanning && (
              <div className="mt-3 text-xs text-sky-700 flex items-center justify-center space-x-2 font-medium">
                <ScanLine className="w-4 h-4 animate-spin text-sky-600" />
                <span>Scanning document & validating NOC criteria...</span>
              </div>
            )}

            {scanResult && !scanning && (
              <div className="mt-2.5 text-xs text-emerald-800 bg-emerald-100/70 p-2 rounded-lg flex items-center justify-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{scanResult}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              NOC Certificate Number *
            </label>
            <input
              type="text"
              placeholder="e.g. NOC-CDR-4819"
              value={nocInput}
              onChange={(e) => setNocInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Format provided on your housing society allotment letter.
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
              className="w-2/3 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Register Resident</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
