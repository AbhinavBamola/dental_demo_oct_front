import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, ExternalLink, Navigation } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { getWhatsAppLink } from '../../config/clinicConfig';

const ContactSection = () => {
  const { clinic } = useClinic();

  const waLink = getWhatsAppLink(
    clinic?.whatsapp,
    `Hello ${clinic?.name || 'SmileCare Dental Clinic'}, I would like to get directions or enquire about an appointment.`
  );

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 tracking-tight">
            Visit SmileCare in Dehradun
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            We are conveniently situated on Rajpur Road, Dehradun with easy parking and direct
            roadside access. Reach out to us directly or visit during clinic hours.
          </p>
        </div>

        {/* 4 Action Buttons Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <a
            href={`tel:${clinic?.phone}`}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-sky-300 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-navy-900">Call Now</span>
            <span className="text-[11px] text-slate-500 mt-0.5">{clinic?.phone}</span>
          </a>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-emerald-300 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-navy-900">WhatsApp</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Instant Chat</span>
          </a>

          <a
            href={`mailto:${clinic?.email}`}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-indigo-300 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-navy-900">Send Email</span>
            <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{clinic?.email}</span>
          </a>

          <a
            href={clinic?.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-teal-300 transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Navigation className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-navy-900">Get Directions</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Open Google Maps</span>
          </a>
        </div>

        {/* Clinic Address & Map Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12">
          {/* Left info */}
          <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded">
                  Clinic Location
                </span>
                <h3 className="text-2xl font-bold text-navy-900 mt-3">
                  SmileCare Dental Clinic
                </h3>
              </div>

              {/* Address details */}
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Address</strong>
                    <p>
                      {clinic?.address?.street}, {clinic?.address?.area}
                    </p>
                    <p>
                      {clinic?.address?.city}, {clinic?.address?.state} – {clinic?.address?.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy-900 block font-semibold">Consultation Timings</strong>
                    <p>{clinic?.openingHours?.weekdays}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{clinic?.openingHours?.sunday}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Action */}
            <div className="pt-6 border-t border-slate-100">
              <a
                href={clinic?.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-all"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Map Embed */}
          <div className="lg:col-span-7 h-80 lg:h-auto min-h-[340px] bg-slate-100 relative">
            <iframe
              title="SmileCare Dental Clinic Location Map"
              src={clinic?.googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
