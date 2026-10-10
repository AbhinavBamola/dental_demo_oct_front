import React from 'react';
import { X, Check, Clock, IndianRupee, Calendar } from 'lucide-react';

const ServiceDetailModal = ({ service, isOpen, onClose, onSelectService }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
            {service.category || 'Dental Care'}
          </span>
          <h3 className="text-2xl font-extrabold text-navy-900 mt-2">{service.name}</h3>
        </div>

        {/* Quick meta strip */}
        <div className="flex items-center gap-5 py-3 border-y border-slate-100 text-xs text-slate-600 mb-5">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Duration: ~{service.durationMinutes || 30} mins</span>
          </div>
          {service.priceStartingAt && (
            <div className="flex items-center gap-1 font-semibold text-emerald-700">
              <IndianRupee className="w-4 h-4" />
              <span>Starting from ₹{service.priceStartingAt.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Full Description */}
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed mb-6">
          <p>{service.fullDescription || service.shortDescription}</p>

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2.5">
                Key Clinical Benefits:
              </h4>
              <ul className="space-y-2">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onSelectService(service);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Book This Treatment</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailModal;
