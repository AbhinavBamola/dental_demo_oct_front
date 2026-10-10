import React, { useState } from 'react';
import {
  Stethoscope,
  Sparkles,
  Sun,
  Activity,
  ShieldCheck,
  Layers,
  Smile,
  HeartHandshake,
  ArrowRight,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import ServiceDetailModal from './ServiceDetailModal';

// Icon mapping helper
const iconMap = {
  Stethoscope,
  Sparkles,
  Sun,
  Activity,
  ShieldCheck,
  Layers,
  Smile,
  HeartHandshake,
};

const Services = ({ onSelectServiceForBooking }) => {
  const { services, loading } = useClinic();
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenDetail = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleBookService = (service) => {
    if (onSelectServiceForBooking) {
      onSelectServiceForBooking(service);
    }
    const element = document.getElementById('book-appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            Specialized Dental Care
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 tracking-tight">
            Complete Dental Services Under One Roof
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            From preventive scaling to computer-guided dental implants, we provide world-class dental
            treatments with painless techniques and high aesthetic precision.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && services.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse p-6" />
            ))}
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComp = iconMap[service.iconName] || Sparkles;

              return (
                <div
                  key={service._id || service.name}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-card hover:border-sky-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Icon & Category tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-navy-900 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                    </div>

                    {/* Service Title */}
                    <h3 className="text-lg font-bold text-navy-900 group-hover:text-sky-600 transition-colors">
                      {service.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Footer info: duration/price & actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        ~{service.durationMinutes} mins
                      </span>
                      {service.priceStartingAt && (
                        <span className="flex items-center font-bold text-navy-900">
                          <IndianRupee className="w-3 h-3 text-slate-400" />
                          <span>From ₹{service.priceStartingAt.toLocaleString('en-IN')}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetail(service)}
                        className="flex-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 py-2 rounded-lg transition-colors"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={() => handleBookService(service)}
                        className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 py-2 rounded-lg transition-colors group-hover:shadow-sm"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA hint */}
        <div className="mt-14 text-center">
          <p className="text-sm text-slate-500">
            Unsure which treatment fits your symptoms?{' '}
            <a
              href="#book-appointment"
              className="text-sky-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Book a General Consultation <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectService={handleBookService}
      />
    </section>
  );
};

export default Services;
