'use client';

import React, { useState } from 'react';
import { DEFAULT_SLOTS } from '@/lib/storage';
import { RouteDirection, ROUTE_LABELS } from '@/types/shuttle';
import { Calendar, Clock, Bus, Users, ArrowRight, ShieldCheck } from 'lucide-react';

interface ScheduleViewProps {
  onSelectSlotToBook: (direction: RouteDirection, time: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onSelectSlotToBook }) => {
  const [activeDirection, setActiveDirection] = useState<RouteDirection>('CDR_TO_KARACHI');

  const slots = DEFAULT_SLOTS.filter((s) => s.direction === activeDirection);

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-400" />
              Shuttle Timetable & Seats
            </h2>
            <p className="text-xs text-slate-400">Daily Express Trips between CDR City & Karachi</p>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            24-30 Seats / Bus
          </span>
        </div>

        {/* Direction Switcher */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveDirection('CDR_TO_KARACHI')}
            className={`py-2 rounded-xl transition-all ${
              activeDirection === 'CDR_TO_KARACHI'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CDR City ➔ Karachi
          </button>
          <button
            onClick={() => setActiveDirection('KARACHI_TO_CDR')}
            className={`py-2 rounded-xl transition-all ${
              activeDirection === 'KARACHI_TO_CDR'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Karachi ➔ CDR City
          </button>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-2.5">
        {slots.map((slot) => {
          const availableSeats = slot.maxCapacity - slot.bookedCount;
          const occupancyPercent = Math.round((slot.bookedCount / slot.maxCapacity) * 100);

          return (
            <div
              key={slot.id}
              className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{slot.time}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {ROUTE_LABELS[slot.direction].label}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectSlotToBook(slot.direction, slot.time)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center space-x-1 transition-all active:scale-95"
                >
                  <span>Book Seat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar & Seat Availability */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Available Seats: <strong className="text-emerald-700 font-bold">{availableSeats}</strong> / {slot.maxCapacity}
                  </span>
                  <span className="text-slate-400 font-mono">{occupancyPercent}% full</span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      occupancyPercent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
