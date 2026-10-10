import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Calendar, ShieldCheck, Sparkles, MessageCircle, User } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { usePatientAuth } from '../../context/PatientAuthContext';
import { getWhatsAppLink } from '../../config/clinicConfig';

const Navbar = () => {
  const { clinic } = useClinic();
  const { patientUser } = usePatientAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Contact', href: '#contact' },
  ];

  const waLink = getWhatsAppLink(
    clinic?.whatsapp,
    `Hello ${clinic?.name}, I would like to enquire about an appointment.`
  );

  return (
    <>
      {/* Top emergency & information bar */}
      <header className="bg-navy-950 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-navy-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span>
                {clinic?.address?.city}, {clinic?.address?.state}: {clinic?.openingHours?.weekdays}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${clinic?.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{clinic?.phone}</span>
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 border-l border-navy-800 pl-4 transition-colors font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Clinic Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main sticky navigation */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled ? 'glass-nav shadow-md py-2.5' : 'bg-white py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Clinic Logo & Brand */}
            <a href="#home" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-navy-900 leading-tight whitespace-nowrap">
                  {clinic?.name || 'SmileCare'}
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase whitespace-nowrap">
                  {clinic?.tagline || 'Dental Clinic'}
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs xl:text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              <Link
                to={patientUser ? '/my-appointments' : '/login'}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-200/80 whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>
                  {patientUser ? `My Appointments (${patientUser.name.split(' ')[0]})` : 'Patient Portal'}
                </span>
              </Link>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200/60 whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>WhatsApp</span>
              </a>

              <a
                href="#book-appointment"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Book Appointment</span>
              </a>
            </div>

            {/* Mobile Actions & Hamburger Toggle */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <a
                href="#book-appointment"
                className="px-3 py-2 text-xs font-bold text-white bg-navy-900 rounded-xl shadow-xs"
              >
                Book Now
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to={patientUser ? '/my-appointments' : '/login'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200/80"
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>
                  {patientUser ? `My Appointments (${patientUser.name})` : 'Patient Login / Signup'}
                </span>
              </Link>

              <a
                href={`tel:${clinic?.phone}`}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-100"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                <span>Call Clinic: {clinic?.phone}</span>
              </a>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Clinic: {clinic?.whatsapp}</span>
              </a>

              <a
                href="#book-appointment"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-navy-900 rounded-xl shadow-xs"
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Book Appointment Online</span>
              </a>

              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center block text-xs text-slate-400 hover:text-slate-600 pt-2 font-medium"
              >
                Clinic Staff / Doctor Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
