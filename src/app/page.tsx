'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BookingForm } from '@/components/BookingForm';
import { MyTickets } from '@/components/MyTickets';
import { ScheduleView } from '@/components/ScheduleView';
import { ConductorPortal } from '@/components/ConductorPortal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { NocRegistrationModal } from '@/components/NocRegistrationModal';
import { EmployeePassModal } from '@/components/EmployeePassModal';
import { getSavedTickets, getSavedUserProfile, clearUserProfile } from '@/lib/storage';
import { Ticket, UserProfile, RouteDirection } from '@/types/shuttle';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'book' | 'tickets' | 'schedule' | 'conductor' | 'admin'>('book');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [isNocModalOpen, setIsNocModalOpen] = useState(false);
  const [isEmpPassModalOpen, setIsEmpPassModalOpen] = useState(false);

  useEffect(() => {
    setUserProfile(getSavedUserProfile());
    setTickets(getSavedTickets());
  }, []);

  const refreshTickets = () => {
    setTickets(getSavedTickets());
  };

  const handleLogout = () => {
    clearUserProfile();
    setUserProfile(null);
  };

  const handleSelectSlotToBook = (direction: RouteDirection, time: string) => {
    setActiveTab('book');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header with Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenNocModal={() => setIsNocModalOpen(true)}
        onOpenEmpPassModal={() => setIsEmpPassModalOpen(true)}
        onLogout={handleLogout}
        ticketCount={tickets.length}
      />

      {/* Viewport Content Container */}
      <main className="flex-1 px-4 pt-4 pb-20 max-w-md mx-auto w-full">
        {activeTab === 'book' && (
          <BookingForm
            userProfile={userProfile}
            onOpenNocModal={() => setIsNocModalOpen(true)}
            onOpenEmpPassModal={() => setIsEmpPassModalOpen(true)}
            onTicketBooked={() => {
              refreshTickets();
            }}
          />
        )}

        {activeTab === 'tickets' && (
          <MyTickets
            tickets={tickets}
            onBookClick={() => setActiveTab('book')}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView onSelectSlotToBook={handleSelectSlotToBook} />
        )}

        {activeTab === 'conductor' && (
          <ConductorPortal onTicketUpdated={refreshTickets} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard tickets={tickets} />
        )}
      </main>

      {/* Registration Modals */}
      <NocRegistrationModal
        isOpen={isNocModalOpen}
        onClose={() => setIsNocModalOpen(false)}
        onSuccess={(profile) => {
          setUserProfile(profile);
        }}
      />

      <EmployeePassModal
        isOpen={isEmpPassModalOpen}
        onClose={() => setIsEmpPassModalOpen(false)}
        onSuccess={(profile) => {
          setUserProfile(profile);
        }}
      />
    </div>
  );
}
