import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppFloatingButton from '../components/common/WhatsAppFloatingButton';
import Hero from '../components/public/Hero';
import TrustBar from '../components/public/TrustBar';
import About from '../components/public/About';
import Services from '../components/public/Services';
import DoctorSection from '../components/public/DoctorSection';
import WhyChooseUs from '../components/public/WhyChooseUs';
import AppointmentBooking from '../components/public/AppointmentBooking';
import ContactSection from '../components/public/ContactSection';

const HomePage = () => {
  const [bookingService, setBookingService] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);

  const handleSelectService = (service) => {
    setBookingService(service);
  };

  const handleSelectDoctor = (doctor) => {
    setBookingDoctor(doctor);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <TrustBar />
        <About />
        <Services onSelectServiceForBooking={handleSelectService} />
        <DoctorSection onSelectDoctorForBooking={handleSelectDoctor} />
        <WhyChooseUs />
        <AppointmentBooking
          preselectedService={bookingService}
          preselectedDoctor={bookingDoctor}
        />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default HomePage;
