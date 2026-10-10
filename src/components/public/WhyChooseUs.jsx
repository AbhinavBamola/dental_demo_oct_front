import React from 'react';
import {
  HeartHandshake,
  Cpu,
  FileCheck,
  Smile,
  CalendarCheck,
  ShieldAlert,
} from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: HeartHandshake,
      title: 'Personalized Treatment Plans',
      desc: 'We never apply one-size-fits-all treatments. Every diagnosis is tailored to your unique anatomical oral requirements and lifestyle.',
    },
    {
      icon: Cpu,
      title: 'Modern Diagnostic Equipment',
      desc: 'Low-dose digital radiography, intraoral cameras, and computerized rotary systems ensure precise and minimally invasive treatments.',
    },
    {
      icon: FileCheck,
      title: 'Transparent Consultations',
      desc: 'No hidden charges or surprise procedures. We walk you through every step, showing your scans and discussing options upfront.',
    },
    {
      icon: Smile,
      title: 'Anxiety-Free & Comfortable',
      desc: 'Gentle chairside manner, soothing clinic ambience, and modern painless anesthetics make fear of the dentist a thing of the past.',
    },
    {
      icon: CalendarCheck,
      title: 'Convenient Online Appointments',
      desc: 'Select your preferred time slot online with real-time confirmation. Zero long queues or unpredictable clinic delays.',
    },
    {
      icon: ShieldAlert,
      title: 'Comprehensive Dental Solutions',
      desc: 'From child dental visits to senior full-mouth restorations, enjoy complete multi-specialty care conveniently under one roof.',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            The SmileCare Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 tracking-tight">
            Why Patients Choose SmileCare
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            We are dedicated to making top-tier clinical dentistry accessible, gentle, and trustworthy
            for families across Dehradun.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => {
            const IconComp = benefit.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-sky-200 hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 text-sky-600 flex items-center justify-center mb-5 group-hover:bg-navy-900 group-hover:text-white transition-colors duration-300 shadow-xs">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2 group-hover:text-sky-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
