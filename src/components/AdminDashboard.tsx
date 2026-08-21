'use client';

import React from 'react';
import { Ticket, ROUTE_LABELS } from '@/types/shuttle';
import { LayoutDashboard, Users, Banknote, Bus, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

interface AdminDashboardProps {
  tickets: Ticket[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ tickets }) => {
  const totalPassengers = tickets.length;
  const totalRevenue = tickets.reduce((acc, t) => acc + t.fare, 0);

  const residentCount = tickets.filter((t) => t.category === 'RESIDENT').length;
  const visitorCount = tickets.filter((t) => t.category === 'VISITOR' || t.category === 'GUEST').length;
  const employeeCount = tickets.filter((t) => t.category === 'EMPLOYEE').length;
  const passHolderCount = tickets.filter((t) => t.category === 'PASS_HOLDER').length;

  const handleExportManifest = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ticket Code,Passenger Name,Phone,Category,Route,Date,Time,Seat,Fare,Status,EasyPaisa TRX']
        .concat(
          tickets.map(
            (t) =>
              `${t.ticketCode},"${t.passengerName}",${t.phone},${t.category},${t.route},${t.date},"${t.timeSlot}",${t.seatNumber},${t.fare},${t.status},${t.easypaisaTrxId || ''}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CDR_Shuttle_Manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-sky-500/20 text-sky-400 p-2 rounded-xl border border-sky-500/30">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">Society Admin Dashboard</h2>
              <p className="text-xs text-slate-400">CDR City Shuttle Operations & Analytics</p>
            </div>
          </div>

          <button
            onClick={handleExportManifest}
            className="bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">TOTAL PASSENGERS</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalPassengers}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Active Bookings Today</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">EASYPAISA REVENUE</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">PKR {totalRevenue}</p>
          <p className="text-[10px] text-slate-500 font-semibold">Received via EasyPaisa</p>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
          Traveler Category Breakdown
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <span className="text-emerald-950">Residents (NOC)</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-lg">
              {residentCount}
            </span>
          </div>

          <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-100 flex items-center justify-between">
            <span className="text-amber-950">Visitors / Guests</span>
            <span className="font-extrabold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-lg">
              {visitorCount}
            </span>
          </div>

          <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-100 flex items-center justify-between">
            <span className="text-purple-950">Pass Holders</span>
            <span className="font-extrabold text-purple-700 bg-purple-200/60 px-2 py-0.5 rounded-lg">
              {passHolderCount}
            </span>
          </div>

          <div className="bg-sky-50 p-2.5 rounded-2xl border border-sky-100 flex items-center justify-between">
            <span className="text-sky-950">Employees</span>
            <span className="font-extrabold text-sky-700 bg-sky-200/60 px-2 py-0.5 rounded-lg">
              {employeeCount}
            </span>
          </div>
        </div>
      </div>

      {/* Live Passenger Manifest List */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
          Live Passenger Manifest
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-900">{t.passengerName}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {t.ticketCode} • {ROUTE_LABELS[t.route].from} ➔ {ROUTE_LABELS[t.route].to} ({t.timeSlot})
                </p>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-emerald-700 block">
                  {t.fare === 0 ? 'FREE' : `PKR ${t.fare}`}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
