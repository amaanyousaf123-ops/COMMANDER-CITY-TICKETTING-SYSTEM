'use client';

import React, { useState } from 'react';
import { Ticket, ROUTE_LABELS } from '@/types/shuttle';
import { DigitalTicketCard } from './DigitalTicketCard';
import { Ticket as TicketIcon, Search, QrCode, Calendar, Clock, Bus, CheckCircle2 } from 'lucide-react';

interface MyTicketsProps {
  tickets: Ticket[];
  onBookClick: () => void;
}

export const MyTickets: React.FC<MyTicketsProps> = ({ tickets, onBookClick }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(
    tickets.length > 0 ? tickets[0] : null
  );
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'BOARDED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const matchesSearch =
      t.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      t.passengerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-base flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-sky-400" />
            My Boarding Passes
          </h2>
          <p className="text-xs text-slate-400">Stored on your device for instant offline access</p>
        </div>

        <button
          onClick={onBookClick}
          className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          + Book New
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl text-center space-y-3 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <TicketIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800">No Active Tickets Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Book your shuttle ticket between CDR City and Karachi in under 30 seconds!
          </p>
          <button
            onClick={onBookClick}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg transition-all"
          >
            Book Ticket Now (PKR 250 / 500)
          </button>
        </div>
      ) : (
        <>
          {/* Selected Ticket Preview Card */}
          {selectedTicket && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active Ticket Pass
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedTicket.ticketCode}
                </span>
              </div>
              <DigitalTicketCard ticket={selectedTicket} />
            </div>
          )}

          {/* Ticket List Header & Search */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search code or passenger name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl text-[10px] font-semibold">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-2 py-1 rounded-lg ${filter === 'ALL' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
                >
                  All ({tickets.length})
                </button>
                <button
                  onClick={() => setFilter('CONFIRMED')}
                  className={`px-2 py-1 rounded-lg ${filter === 'CONFIRMED' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Active
                </button>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                const routeInfo = ROUTE_LABELS[ticket.route];
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{ticket.ticketCode}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                          Seat #{ticket.seatNumber}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{routeInfo.label}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ticket.date} • {ticket.timeSlot}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 block">
                        {ticket.fare === 0 ? 'FREE' : `PKR ${ticket.fare}`}
                      </span>
                      <button className="text-[10px] font-bold text-sky-600 mt-1 flex items-center gap-0.5 justify-end">
                        <QrCode className="w-3 h-3" />
                        <span>View QR</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
