export type PassengerCategory = 'RESIDENT' | 'VISITOR' | 'GUEST' | 'PASS_HOLDER' | 'EMPLOYEE';

export type RouteDirection = 'CDR_TO_KARACHI' | 'KARACHI_TO_CDR';

export type PaymentStatus = 'PENDING' | 'PAID_EASYPAISA' | 'PASS_VERIFIED';

export interface ShuttleSlot {
  id: string;
  time: string; // e.g. "07:00 AM", "10:00 AM"
  direction: RouteDirection;
  maxCapacity: number; // 24 to 30
  bookedCount: number;
}

export interface Ticket {
  id: string;
  ticketCode: string; // e.g. "CDR-89421"
  passengerName: string;
  phone: string;
  category: PassengerCategory;
  route: RouteDirection;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  seatNumber: number;
  fare: number; // 250 for resident/emp, 500 for visitor/guest, 0 for pass holder
  paymentStatus: PaymentStatus;
  easypaisaTrxId?: string;
  nocNumber?: string;
  employeeId?: string;
  passNumber?: string;
  status: 'CONFIRMED' | 'BOARDED' | 'CANCELLED';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  category: PassengerCategory;
  nocNumber?: string;
  employeeId?: string;
  passNumber?: string;
  verifiedAt?: string;
}

export const FARES: Record<PassengerCategory, number> = {
  RESIDENT: 250,
  EMPLOYEE: 250,
  VISITOR: 500,
  GUEST: 500,
  PASS_HOLDER: 0,
};

export const ROUTE_LABELS: Record<RouteDirection, { from: string; to: string; label: string }> = {
  CDR_TO_KARACHI: {
    from: 'CDR City',
    to: 'Karachi Central',
    label: 'CDR City ➔ Karachi',
  },
  KARACHI_TO_CDR: {
    from: 'Karachi Central',
    to: 'CDR City',
    label: 'Karachi ➔ CDR City',
  },
};
