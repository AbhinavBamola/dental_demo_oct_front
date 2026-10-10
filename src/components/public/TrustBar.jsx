import React from 'react';
import { Clock, PhoneCall, MapPin, CalendarCheck2 } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

const TrustBar = () => {
  const { clinic } = useClinic();

  const trustItems = [
    {
      icon: Clock,
      title: 'Opening Hours',
      line1: clinic?.openingHours?.weekdays || 'Mon – Sat: 9:00 AM – 7:30 PM',
      line2: clinic?.openingHours?.sunday || 'Sunday: By Appointment',
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
    },
    {
      icon: PhoneCall,
      title: 'Emergency Contact',
      line1: clinic?.phone || '+91 98765 43210',
      line2: 'Call for Urgent Dental Relief',
      link: `tel:${clinic?.phone}`,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      icon: MapPin,
      title: 'Clinic Location',
      line1: `${clinic?.address?.street || 'Rajpur Road'}, ${clinic?.address?.city || 'Dehradun'}`,
      line2: 'Convenient Parking Available',
      link: '#contact',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: CalendarCheck2,
      title: 'Instant Booking',
      line1: 'Online Slot Confirmation',
      line2: 'Zero Waiting Time Guaranteed',
      link: '#book-appointment',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <section className="relative -mt-8 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {trustItems.map((item, idx) => {
          const IconComponent = item.icon;
          const Content = (
            <div className="flex items-start gap-3.5 group">
              <div
                className={`w-12 h-12 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.title}
                </h2>
                <div className="text-sm font-bold text-navy-900 mt-0.5 group-hover:text-sky-600 transition-colors">
                  {item.line1}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{item.line2}</div>
              </div>
            </div>
          );

          if (item.link) {
            return (
              <a
                key={idx}
                href={item.link}
                className="block hover:opacity-95 transition-opacity"
              >
                {Content}
              </a>
            );
          }

          return <div key={idx}>{Content}</div>;
        })}
      </div>
    </section>
  );
};

export default TrustBar;
