'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, ROUTE_LABELS } from '@/types/shuttle';
import { Bus, Calendar, Clock, User, Phone, CheckCircle2, Download, Share2, Sparkles } from 'lucide-react';

interface DigitalTicketCardProps {
  ticket: Ticket;
  onClose?: () => void;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({ ticket }) => {
  const routeInfo = ROUTE_LABELS[ticket.route];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `CDR Shuttle Ticket ${ticket.ticketCode}`,
        text: `Shuttle Ticket: ${ticket.ticketCode}\nPassenger: ${ticket.passengerName}\nRoute: ${routeInfo.label}\nTime: ${ticket.timeSlot}\nSeat: ${ticket.seatNumber}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Ticket Code: ${ticket.ticketCode} | Seat: ${ticket.seatNumber} | Route: ${routeInfo.label}`);
      alert('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-2">
      {/* Boarding Pass Container */}
      <div className="ticket-card rounded-3xl text-white shadow-2xl overflow-hidden border border-slate-700/80">
        
        {/* Top Header Strip */}
        <div className="bg-slate-900/90 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="bg-sky-500/20 text-sky-400 p-1.5 rounded-lg border border-sky-500/30">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Housing Society Express</p>
              <h4 className="font-bold text-sm text-white tracking-tight">CDR CITY SHUTTLE PASS</h4>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
              ticket.category === 'RESIDENT'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : ticket.category === 'VISITOR' || ticket.category === 'GUEST'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}>
              {ticket.category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Journey Details Block */}
        <div className="p-5 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="flex items-center justify-between my-2">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">DEPARTURE</p>
              <h3 className="text-lg font-extrabold text-white">{routeInfo.from}</h3>
            </div>

            <div className="flex flex-col items-center px-4">
              <div className="flex items-center space-x-1.5 text-sky-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <Bus className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
              <div className="w-24 h-0.5 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500 rounded-full" />
              <span className="text-[9px] text-slate-400 mt-1 font-mono">NON-STOP</span>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">DESTINATION</p>
              <h3 className="text-lg font-extrabold text-white">{routeInfo.to}</h3>
            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-3 gap-2 mt-5 bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800">
            <div>
              <p className="text-[9px] text-slate-400 font-semibold uppercase">DATE</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-400" />
                {ticket.date}
              </p>
            </div>

            <div>
              <p className="text-[9px] text-slate-400 font-semibold uppercase">TIME SLOT</p>
              <p className="text-xs font-bold text-sky-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" />
                {ticket.timeSlot}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-semibold uppercase">SEAT NO.</p>
              <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                #{ticket.seatNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Cutout Notches & Dashed Separator */}
        <div className="relative py-2">
          <div className="ticket-notch-left" />
          <div className="ticket-notch-right" />
          <div className="ticket-dashed-line mx-6" />
        </div>

        {/* Lower Portion: Passenger Details & QR Code */}
        <div className="p-5 bg-slate-900 flex items-center justify-between">
          <div className="space-y-2 pr-3">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">PASSENGER NAME</p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                {ticket.passengerName}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">TICKET CODE</p>
              <p className="text-xs font-mono font-bold text-sky-300 tracking-wider">
                {ticket.ticketCode}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">FARE PAID</p>
              <p className="text-xs font-bold text-emerald-400">
                {ticket.fare === 0 ? 'Monthly Pass (FREE)' : `PKR ${ticket.fare} (EasyPaisa)`}
              </p>
            </div>
          </div>

          {/* Dynamic QR Code Display */}
          <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center shrink-0">
            <QRCodeSVG
              value={JSON.stringify({
                code: ticket.ticketCode,
                name: ticket.passengerName,
                route: ticket.route,
                time: ticket.timeSlot,
                seat: ticket.seatNumber,
                status: ticket.status,
              })}
              size={96}
              level="H"
              includeMargin={false}
            />
            <p className="text-[9px] font-mono font-bold text-slate-700 mt-1.5 tracking-tight">SCAN BOARDING</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-3 px-5 flex items-center justify-between border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CONFIRMED TICKET</span>
          </div>

          <button
            onClick={handleShare}
            className="bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
