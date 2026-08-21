'use client';

import React from 'react';
import { Bus, ShieldCheck, Ticket, Calendar, QrCode, LayoutDashboard, UserCheck, LogOut, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types/shuttle';

interface HeaderProps {
  activeTab: 'book' | 'tickets' | 'schedule' | 'conductor' | 'admin';
  setActiveTab: (tab: 'book' | 'tickets' | 'schedule' | 'conductor' | 'admin') => void;
  userProfile: UserProfile | null;
  onOpenNocModal: () => void;
  onOpenEmpPassModal: () => void;
  onLogout: () => void;
  ticketCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenNocModal,
  onOpenEmpPassModal,
  onLogout,
  ticketCount,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-gradient-to-tr from-sky-500 to-emerald-400 p-2 rounded-xl text-white shadow-lg shadow-sky-500/20">
              <Bus className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-bold text-base tracking-tight text-white">CDR CITY SHUTTLE</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Housing Society Express Service</p>
            </div>
          </div>

          {/* Identity Badge or Login Action */}
          <div>
            {userProfile ? (
              <div className="flex items-center space-x-2">
                <div className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-right">
                  <p className="text-xs font-semibold text-sky-400 flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {userProfile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide">
                    {userProfile.category}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenNocModal}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center space-x-1 transition-all shadow-sm active:scale-95"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Resident NOC</span>
                </button>
                <button
                  onClick={onOpenEmpPassModal}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>ID / Pass</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 h-16">
          <button
            onClick={() => setActiveTab('book')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
              activeTab === 'book' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span className="text-[10px]">Book</span>
            {activeTab === 'book' && (
              <span className="absolute bottom-1 w-5 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
              activeTab === 'tickets' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Ticket className="w-5 h-5" />
              {ticketCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {ticketCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">My Passes</span>
            {activeTab === 'tickets' && (
              <span className="absolute bottom-1 w-5 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
              activeTab === 'schedule' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Schedule</span>
            {activeTab === 'schedule' && (
              <span className="absolute bottom-1 w-5 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('conductor')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
              activeTab === 'conductor' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span className="text-[10px]">Conductor</span>
            {activeTab === 'conductor' && (
              <span className="absolute bottom-1 w-5 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
              activeTab === 'admin' ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px]">Admin</span>
            {activeTab === 'admin' && (
              <span className="absolute bottom-1 w-5 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
