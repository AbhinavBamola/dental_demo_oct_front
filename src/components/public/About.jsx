import React from 'react';
import { Award, Cpu, Smile, Sparkles, CheckCircle2 } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

const About = () => {
  const { clinic } = useClinic();

  const features = [
    {
      icon: Award,
      title: 'Experienced Care',
      desc: 'Led by certified MDS specialists with over a decade of surgical and aesthetic clinical practice.',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      icon: Cpu,
      title: 'Modern Technology',
      desc: 'Equipped with low-radiation digital X-rays, motorized rotary endodontics, and intraoral 3D scanners.',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      icon: Smile,
      title: 'Comfortable Environment',
      desc: 'Designed as a soothing, anxiety-free dental haven with ergonomic dental chairs and gentle staff.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: Sparkles,
      title: 'Personalized Treatment',
      desc: 'Every smile is unique. We provide transparent consultations and customized treatment options without rush.',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full">
            About Our Practice
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 tracking-tight">
            Setting a Higher Standard in Dental Care
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            {clinic?.description ||
              'At SmileCare Dental Clinic, we believe dental visits should be transparent, gentle, and empowering. Our clinic combines experienced clinical craftsmanship with state-of-the-art sterilization protocols to protect your oral health.'}
          </p>
        </div>

        {/* Two Column Layout: Visual Left, Philosophy & Cards Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                alt="Dental Clinic Sterilization and Consultation"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-semibold tracking-wider uppercase text-sky-300">
                  Strict Infection Control
                </span>
                <p className="text-sm font-medium mt-1">
                  Class-B Autoclave 5-Stage Sterilization for Every Patient Instrument
                </p>
              </div>
            </div>

            {/* Floating Experience Pill */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-4 rounded-2xl shadow-card border border-slate-100 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h3 className="text-xs font-bold text-navy-900">Hospital-Grade Safety</h3>
                  <p className="text-[11px] text-slate-500">ISO-compliant sterilization cycle</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Philosophy & 4 Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-navy-900">
                Patient-Centric Dental Wellness in Dehradun
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you visit for a routine ultrasonic cleaning or an advanced titanium implant
                reconstruction, our priority is always your peace of mind. We take the time to explain
                every procedure, discuss digital X-rays clearly, and offer painless anesthetic techniques.
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-card transition-shadow"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-navy-900 mb-1.5">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick checklist */}
            <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero Unnecessary Treatments
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Transparent Pricing
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Digital Intraoral Imaging
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
