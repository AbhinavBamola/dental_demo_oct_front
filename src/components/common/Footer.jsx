import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { getWhatsAppLink } from '../../config/clinicConfig';

const Footer = () => {
  const { clinic, services } = useClinic();
  const currentYear = new Date().getFullYear();

  const waLink = getWhatsAppLink(
    clinic?.whatsapp,
    `Hello ${clinic?.name}, I would like to enquire about your dental services.`
  );

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-10 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  {clinic?.name || 'SmileCare Dental Clinic'}
                </span>
                <span className="text-xs text-sky-400 font-medium uppercase tracking-wider">
                  {clinic?.tagline || 'Gentle Care, Confident Smiles'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {clinic?.description ||
                'Delivering compassionate, technology-driven oral healthcare in Dehradun with sterilized modern clinics and friendly specialists.'}
            </p>
            <div className="pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#home" className="hover:text-sky-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-sky-400 transition-colors">
                  About Our Clinic
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-sky-400 transition-colors">
                  Dental Treatments
                </a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-sky-400 transition-colors">
                  Our Specialists
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-sky-400 transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#book-appointment" className="hover:text-sky-400 transition-colors">
                  Book Online Appointment
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services Offered */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {services && services.length > 0 ? (
                services.slice(0, 6).map((service) => (
                  <li key={service._id}>
                    <a href="#services" className="hover:text-sky-400 transition-colors line-clamp-1">
                      {service.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>Teeth Cleaning & Polishing</li>
                  <li>Root Canal Treatment</li>
                  <li>Dental Implants</li>
                  <li>Clear Aligners</li>
                  <li>Teeth Whitening</li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Visit Clinic
            </h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                {clinic?.address?.street}, {clinic?.address?.area}, {clinic?.address?.city},{' '}
                {clinic?.address?.state} - {clinic?.address?.pincode}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <a href={`tel:${clinic?.phone}`} className="hover:text-white transition-colors">
                {clinic?.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <a href={`mailto:${clinic?.email}`} className="hover:text-white transition-colors">
                {clinic?.email}
              </a>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p>{clinic?.openingHours?.weekdays}</p>
                <p className="text-xs text-slate-500">{clinic?.openingHours?.sunday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {clinic?.name || 'SmileCare Dental Clinic'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href={clinic?.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clinic Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
