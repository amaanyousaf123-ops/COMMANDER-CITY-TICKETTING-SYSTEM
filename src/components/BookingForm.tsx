'use client';

import React, { useState } from 'react';
import { RouteDirection, PassengerCategory, ShuttleSlot, Ticket, UserProfile, FARES, ROUTE_LABELS } from '@/types/shuttle';
import { DEFAULT_SLOTS, generateTicketCode, saveTickets, getSavedTickets } from '@/lib/storage';
import { EasyPaisaPaymentModal } from './EasyPaisaPaymentModal';
import { DigitalTicketCard } from './DigitalTicketCard';
import { Bus, Calendar, Clock, User, Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Ticket as TicketIcon, Users } from 'lucide-react';



interface BookingFormProps {
  userProfile: UserProfile | null;
  onOpenNocModal: () => void;
  onOpenEmpPassModal: () => void;
  onTicketBooked: (ticket: Ticket) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  userProfile,
  onOpenNocModal,
  onOpenEmpPassModal,
  onTicketBooked,
}) => {
  const [route, setRoute] = useState<RouteDirection>('CDR_TO_KARACHI');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<ShuttleSlot>(DEFAULT_SLOTS[1]); // Default 08:30 AM
  const [category, setCategory] = useState<PassengerCategory>(
    userProfile ? userProfile.category : 'VISITOR'
  );

  const [passengerName, setPassengerName] = useState(userProfile ? userProfile.name : '');
  const [phone, setPhone] = useState(userProfile ? userProfile.phone : '');
  const [seatCount, setSeatCount] = useState<number>(1);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync category & details if userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setCategory(userProfile.category);
      setPassengerName(userProfile.name);
      setPhone(userProfile.phone);
    }
  }, [userProfile]);

  const slotsForRoute = DEFAULT_SLOTS.filter((s) => s.direction === route);
  const perTicketFare = FARES[category];
  const totalPayableFare = perTicketFare * seatCount;

  const handleInitiateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passengerName.trim()) {
      setError('Please enter passenger full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid mobile phone number.');
      return;
    }

    // Check capacity
    const availableSeats = selectedSlot.maxCapacity - selectedSlot.bookedCount;
    if (seatCount > availableSeats) {
      setError(`Only ${availableSeats} seats remaining for ${selectedSlot.time} slot.`);
      return;
    }

    // If free (Pass Holder), confirm immediately without payment gateway
    if (totalPayableFare === 0) {
      completeBooking('PASS_VERIFIED', 'PASS-FREE-EXEMPT');
    } else {
      // Launch EasyPaisa Payment Modal
      setShowPaymentModal(true);
    }
  };

  const completeBooking = (paymentStatus: 'PAID_EASYPAISA' | 'PASS_VERIFIED', trxId?: string) => {
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      ticketCode: generateTicketCode(),
      passengerName: passengerName.trim(),
      phone: phone.trim(),
      category: category,
      route: route,
      date: date,
      timeSlot: selectedSlot.time,
      seatNumber: selectedSlot.bookedCount + 1,
      fare: totalPayableFare,
      paymentStatus: paymentStatus,
      easypaisaTrxId: trxId,
      nocNumber: userProfile?.nocNumber,
      employeeId: userProfile?.employeeId,
      passNumber: userProfile?.passNumber,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    const existing = getSavedTickets();
    saveTickets([newTicket, ...existing]);
    onTicketBooked(newTicket);
    setConfirmedTicket(newTicket);

    // Trigger celebration confetti
    try {
      if (typeof window !== 'undefined') {
        const confetti = require('canvas-confetti');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch {}
  };

  return (
    <div className="space-y-4 pb-20">
      {confirmedTicket ? (
        <div className="animate-fadeIn space-y-4">
          <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-6 h-6 text-white" />
              <div>
                <h3 className="font-bold text-sm">Ticket Booked Successfully!</h3>
                <p className="text-xs text-emerald-100">Ready to show conductor at shuttle door</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmedTicket(null)}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
            >
              Book Another
            </button>
          </div>

          <DigitalTicketCard ticket={confirmedTicket} />
        </div>
      ) : (
        <form onSubmit={handleInitiateBooking} className="space-y-4">
          
          {/* Banner Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-sky-500/10 rounded-full blur-xl" />
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-sky-500/20 text-sky-400 p-2 rounded-2xl border border-sky-500/30">
                <Bus className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight">Book Shuttle Ticket</h2>
                <p className="text-xs text-slate-300">CDR City Housing Society Service</p>
              </div>
            </div>

            {/* Direction Toggle Pills */}
            <div className="grid grid-cols-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mt-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  setRoute('CDR_TO_KARACHI');
                  const newSlots = DEFAULT_SLOTS.filter((s) => s.direction === 'CDR_TO_KARACHI');
                  setSelectedSlot(newSlots[0]);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center space-y-0.5 ${
                  route === 'CDR_TO_KARACHI'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>CDR City ➔ Karachi</span>
                <span className="text-[9px] font-normal opacity-80">From CDR City Gate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoute('KARACHI_TO_CDR');
                  const newSlots = DEFAULT_SLOTS.filter((s) => s.direction === 'KARACHI_TO_CDR');
                  setSelectedSlot(newSlots[0]);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center space-y-0.5 ${
                  route === 'KARACHI_TO_CDR'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Karachi ➔ CDR City</span>
                <span className="text-[9px] font-normal opacity-80">From Cantt Station</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl font-medium">
              {error}
            </div>
          )}

          {/* Step 1: Select Date & Time Slot */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-sky-600" />
                1. Select Travel Date & Schedule Slot
              </h3>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs font-semibold bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 focus:outline-none"
              />
            </div>

            {/* Time Slot Horizontal Chips */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {slotsForRoute.map((slot) => {
                const available = slot.maxCapacity - slot.bookedCount;
                const isSelected = selectedSlot.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-md ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        available > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {available} seats
                      </span>
                    </div>
                    <p className="text-xs font-bold mt-1.5">{slot.time}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">Cap: {slot.maxCapacity} seats</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Passenger Category Selection */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-4 h-4 text-emerald-600" />
                2. Select Passenger Category
              </h3>
              {!userProfile && (
                <button
                  type="button"
                  onClick={onOpenNocModal}
                  className="text-[10px] font-semibold text-emerald-600 underline"
                >
                  Have NOC? Verify Resident Rate
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('RESIDENT')}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  category === 'RESIDENT'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Resident</span>
                  <span className="text-xs font-extrabold text-emerald-600">PKR 250</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Requires Society NOC verification</p>
              </button>

              <button
                type="button"
                onClick={() => setCategory('VISITOR')}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  category === 'VISITOR'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Visitor / Guest</span>
                  <span className="text-xs font-extrabold text-emerald-600">PKR 500</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Instant direct booking without login</p>
              </button>

              <button
                type="button"
                onClick={() => setCategory('EMPLOYEE')}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  category === 'EMPLOYEE'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Employee</span>
                  <span className="text-xs font-extrabold text-emerald-600">PKR 250</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Society staff card number</p>
              </button>

              <button
                type="button"
                onClick={() => setCategory('PASS_HOLDER')}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  category === 'PASS_HOLDER'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Pass Holder</span>
                  <span className="text-xs font-extrabold text-emerald-600">FREE</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Prepaid monthly pass number</p>
              </button>
            </div>
          </div>

          {/* Step 3: Passenger Details */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-4 h-4 text-sky-600" />
              3. Passenger Details
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Passenger Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter passenger name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Number of Seats
                  </label>
                  <select
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-semibold"
                  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout & EasyPaisa Fare Summary Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-xl flex items-center justify-between border border-slate-800">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Payable</p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-emerald-400">
                  {totalPayableFare === 0 ? 'FREE' : `PKR ${totalPayableFare}`}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({seatCount} x PKR {perTicketFare})
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all active:scale-95"
            >
              <span>{totalPayableFare === 0 ? 'Confirm Free Pass' : 'Pay via EasyPaisa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* EasyPaisa Modal */}
      <EasyPaisaPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={totalPayableFare}
        passengerName={passengerName}
        category={category}
        timeSlot={selectedSlot.time}
        routeLabel={ROUTE_LABELS[route].label}
        onPaymentSuccess={(trxId) => completeBooking('PAID_EASYPAISA', trxId)}
      />
    </div>
  );
};
