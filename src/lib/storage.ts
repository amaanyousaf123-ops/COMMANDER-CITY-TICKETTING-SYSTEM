import { Ticket, ShuttleSlot, UserProfile, RouteDirection, PassengerCategory, FARES } from '@/types/shuttle';

const TICKETS_KEY = 'cdrcity_shuttle_tickets';
const USER_KEY = 'cdrcity_shuttle_user';
const SLOTS_KEY = 'cdrcity_shuttle_slots';

// Initial default daily schedule slots
export const DEFAULT_SLOTS: ShuttleSlot[] = [
  // CDR City to Karachi
  { id: 'slot-cdr-1', time: '06:30 AM', direction: 'CDR_TO_KARACHI', maxCapacity: 24, bookedCount: 5 },
  { id: 'slot-cdr-2', time: '08:30 AM', direction: 'CDR_TO_KARACHI', maxCapacity: 24, bookedCount: 14 },
  { id: 'slot-cdr-3', time: '11:00 AM', direction: 'CDR_TO_KARACHI', maxCapacity: 24, bookedCount: 8 },
  { id: 'slot-cdr-4', time: '02:30 PM', direction: 'CDR_TO_KARACHI', maxCapacity: 24, bookedCount: 3 },
  { id: 'slot-cdr-5', time: '05:30 PM', direction: 'CDR_TO_KARACHI', maxCapacity: 28, bookedCount: 19 },
  { id: 'slot-cdr-6', time: '08:30 PM', direction: 'CDR_TO_KARACHI', maxCapacity: 24, bookedCount: 2 },

  // Karachi to CDR City
  { id: 'slot-khi-1', time: '07:30 AM', direction: 'KARACHI_TO_CDR', maxCapacity: 24, bookedCount: 9 },
  { id: 'slot-khi-2', time: '09:30 AM', direction: 'KARACHI_TO_CDR', maxCapacity: 24, bookedCount: 11 },
  { id: 'slot-khi-3', time: '01:00 PM', direction: 'KARACHI_TO_CDR', maxCapacity: 24, bookedCount: 6 },
  { id: 'slot-khi-4', time: '04:00 PM', direction: 'KARACHI_TO_CDR', maxCapacity: 28, bookedCount: 22 },
  { id: 'slot-khi-5', time: '07:00 PM', direction: 'KARACHI_TO_CDR', maxCapacity: 24, bookedCount: 17 },
  { id: 'slot-khi-6', time: '09:30 PM', direction: 'KARACHI_TO_CDR', maxCapacity: 24, bookedCount: 4 },
];

// Helper to load tickets
export function getSavedTickets(): Ticket[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    if (!data) {
      // Seed with 1 mock sample ticket for easy immediate testing
      const sampleTicket: Ticket = {
        id: 't-sample-1',
        ticketCode: 'CDR-94281',
        passengerName: 'Ali Raza',
        phone: '0300-1234567',
        category: 'RESIDENT',
        route: 'CDR_TO_KARACHI',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '08:30 AM',
        seatNumber: 12,
        fare: 250,
        paymentStatus: 'PAID_EASYPAISA',
        easypaisaTrxId: 'EP-98234712',
        nocNumber: 'NOC-CDR-4819',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(TICKETS_KEY, JSON.stringify([sampleTicket]));
      return [sampleTicket];
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save tickets
export function saveTickets(tickets: Ticket[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

// User Profile Storage
export function getSavedUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

export function clearUserProfile() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

// Generate unique ticket code
export function generateTicketCode(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CDR-${randomNum}`;
}

// NOC Scanner / Validation Simulation Criteria
export function verifyNOCDocument(nocInput: string): { valid: boolean; message: string; nocFormatted?: string } {
  const clean = nocInput.trim().toUpperCase();
  if (!clean) {
    return { valid: false, message: 'Please provide NOC document number or image.' };
  }
  // Accepts standard CDR City housing society NOC format or any valid alpha-numeric reference >= 4 chars
  if (clean.length >= 4) {
    const nocFormatted = clean.startsWith('NOC-') ? clean : `NOC-CDR-${clean}`;
    return {
      valid: true,
      message: 'NOC verified successfully against CDR Housing Society Database.',
      nocFormatted,
    };
  }
  return { valid: false, message: 'Invalid NOC number format. Format: NOC-CDR-XXXX' };
}

// Employee ID Verification Simulation
export function verifyEmployeeId(empIdInput: string): { valid: boolean; message: string; empFormatted?: string } {
  const clean = empIdInput.trim().toUpperCase();
  if (!clean || clean.length < 3) {
    return { valid: false, message: 'Employee ID must be at least 3 digits/characters.' };
  }
  const empFormatted = clean.startsWith('EMP-') ? clean : `EMP-${clean}`;
  return { valid: true, message: 'Employee identity confirmed.', empFormatted };
}

// Monthly Pass Number Verification Simulation (Changes Monthly, e.g. PASS-AUG26-XXXX)
export function verifyPassNumber(passInput: string): { valid: boolean; message: string; passFormatted?: string } {
  const clean = passInput.trim().toUpperCase();
  if (!clean || clean.length < 4) {
    return { valid: false, message: 'Pass number must be valid for the current month.' };
  }
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', '').toUpperCase();
  const passFormatted = clean.startsWith('PASS-') ? clean : `PASS-${currentMonthYear}-${clean}`;
  return { valid: true, message: `Active Monthly Pass (${currentMonthYear}) verified!`, passFormatted };
}
