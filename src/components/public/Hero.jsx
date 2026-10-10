import React from 'react';
import { Calendar, MessageCircle, ShieldCheck, Sparkles, Award, Clock, HeartHandshake } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { getWhatsAppLink } from '../../config/clinicConfig';

const Hero = () => {
  const { clinic, doctors } = useClinic();

  const waLink = getWhatsAppLink(
    clinic?.whatsapp,
    `Hello ${clinic?.name || 'SmileCare Dental Clinic'}, I would like to book a dental consultation.`
  );

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-10 pb-20 md:pt-16 md:pb-28">
      {/* Background soft ambient blur shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>{clinic?.heroBadge || 'Trusted Dental Care in Dehradun'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12]">
              {clinic?.heroHeadline || 'Confident Smiles Start Here.'}
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {clinic?.heroSubtext ||
                'Comprehensive dental care delivered with modern technology, experienced professionals, and a patient-first approach.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#book-appointment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-base shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-5 h-5 text-sky-400" />
                <span>Book an Appointment</span>
              </a>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/70 border border-slate-100 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-navy-900">Experienced Care</h2>
                  <p className="text-xs text-slate-500">MDS Dental Surgeons</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/70 border border-slate-100 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-navy-900">100% Sterile</h2>
                  <p className="text-xs text-slate-500">Hospital Grade Hygiene</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/70 border border-slate-100 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-navy-900">Painless Tech</h2>
                  <p className="text-xs text-slate-500">Gentle Patient Comfort</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=900"
                  alt="Modern Dental Clinic Operatory"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                
                {/* Overlay Text Inside Card */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-sky-500/80 text-[11px] font-semibold tracking-wide uppercase mb-1">
                    State-of-the-Art Clinic
                  </span>
                  <h3 className="text-lg font-bold leading-snug">
                    Advanced Digital Dentistry in Dehradun
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Rotary RCT • Titanium Implants • Invisible Aligners
                  </p>
                </div>
              </div>

              {/* Floating Doctor Badge */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-slate-100 flex items-center gap-3 max-w-[240px]">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-sky-100 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                    alt="Dr. Rohan Sharma"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-900 leading-tight">
                    {doctors[0]?.name || 'Dr. Rohan Sharma'}
                  </div>
                  <div className="text-[11px] text-sky-700 font-medium">BDS, MDS Surgeon</div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available Today
                  </div>
                </div>
              </div>

              {/* Floating Quick Timing Badge */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-card border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy-900">Today's Clinic Hours</div>
                  <div className="text-[11px] text-slate-600">9:00 AM – 7:30 PM</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
