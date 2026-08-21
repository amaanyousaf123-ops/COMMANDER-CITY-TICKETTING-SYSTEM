'use client';

import React, { useState } from 'react';
import { Ticket, ROUTE_LABELS } from '@/types/shuttle';
import { getSavedTickets, saveTickets } from '@/lib/storage';
import { QrCode, Search, CheckCircle2, AlertCircle, Scan, Bus, ShieldCheck, UserCheck } from 'lucide-react';

interface ConductorPortalProps {
  onTicketUpdated: () => void;
}

export const ConductorPortal: React.FC<ConductorPortalProps> = ({ onTicketUpdated }) => {
  const [searchInput, setSearchInput] = useState('');
  const [verifiedTicket, setVerifiedTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanningSimulated, setScanningSimulated] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(0);

  const handleSearchOrScan = (codeToSearch?: string) => {
    setError(null);
    setVerifiedTicket(null);

    const term = (codeToSearch || searchInput).trim().toUpperCase();
    if (!term) {
      setError('Please enter or scan a Ticket Code (e.g. CDR-94281).');
      return;
    }

    const allTickets = getSavedTickets();
    const found = allTickets.find(
      (t) => t.ticketCode.toUpperCase() === term || t.id.toUpperCase() === term
    );

    if (!found) {
      setError(`Ticket "${term}" not found in housing society database.`);
    } else {
      setVerifiedTicket(found);
    }
  };

  const handleSimulateCameraScan = () => {
    setScanningSimulated(true);
    setError(null);
    setVerifiedTicket(null);

    setTimeout(() => {
      setScanningSimulated(false);
      const allTickets = getSavedTickets();
      if (allTickets.length > 0) {
        setVerifiedTicket(allTickets[0]);
      } else {
        setError('No active tickets stored in local system to scan.');
      }
    }, 1500);
  };

  const handleMarkBoarded = () => {
    if (!verifiedTicket) return;

    const allTickets = getSavedTickets();
    const updated = allTickets.map((t) => {
      if (t.id === verifiedTicket.id) {
        return { ...t, status: 'BOARDED' as const };
      }
      return t;
    });

    saveTickets(updated);
    setVerifiedTicket({ ...verifiedTicket, status: 'BOARDED' });
    setCheckedInCount((prev) => prev + 1);
    onTicketUpdated();
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Conductor Mobile Scanner Header */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">Conductor Verification Mode</h2>
              <p className="text-xs text-slate-400">Validate passenger tickets at shuttle door</p>
            </div>
          </div>
          <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            Check-Ins: {checkedInCount}
          </span>
        </div>

        {/* Scan Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleSimulateCameraScan}
            disabled={scanningSimulated}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Scan className="w-4 h-4 animate-pulse" />
            <span>{scanningSimulated ? 'Scanning QR Code...' : 'Open QR Scanner'}</span>
          </button>

          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <input
              type="text"
              placeholder="CDR-XXXXX"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent px-2 text-xs font-mono text-white focus:outline-none"
            />
            <button
              onClick={() => handleSearchOrScan()}
              className="bg-sky-600 hover:bg-sky-500 text-white p-1.5 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Verified Ticket Inspection Card */}
      {verifiedTicket && (
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-200 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-sky-600" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{verifiedTicket.passengerName}</h3>
                <p className="text-xs text-slate-500 font-mono">{verifiedTicket.ticketCode}</p>
              </div>
            </div>

            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
              verifiedTicket.status === 'BOARDED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {verifiedTicket.status}
            </span>
          </div>

          {/* Key Ticket Specs */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">ROUTE</p>
              <p className="font-bold text-slate-800 mt-0.5">{ROUTE_LABELS[verifiedTicket.route].label}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">TIME SLOT / SEAT</p>
              <p className="font-bold text-slate-800 mt-0.5">{verifiedTicket.timeSlot} • Seat #{verifiedTicket.seatNumber}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">CATEGORY</p>
              <p className="font-bold text-emerald-700 mt-0.5">{verifiedTicket.category}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">FARE / PAYMENT</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {verifiedTicket.fare === 0 ? 'Monthly Pass' : `PKR ${verifiedTicket.fare}`}
              </p>
            </div>
          </div>

          {verifiedTicket.nocNumber && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-2.5 rounded-xl flex items-center justify-between font-mono">
              <span>Verified NOC:</span>
              <strong className="font-bold">{verifiedTicket.nocNumber}</strong>
            </div>
          )}

          {verifiedTicket.easypaisaTrxId && (
            <div className="bg-slate-100 text-slate-700 text-xs p-2.5 rounded-xl flex items-center justify-between font-mono">
              <span>EasyPaisa TRX:</span>
              <strong className="font-bold text-emerald-700">{verifiedTicket.easypaisaTrxId}</strong>
            </div>
          )}

          {/* Action Button */}
          {verifiedTicket.status === 'CONFIRMED' ? (
            <button
              onClick={handleMarkBoarded}
              className="w-full py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Passenger as BOARDED</span>
            </button>
          ) : (
            <div className="bg-emerald-100 text-emerald-800 text-xs p-3 rounded-xl font-bold text-center flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PASSENGER ALREADY BOARDED & CHECKED-IN</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
