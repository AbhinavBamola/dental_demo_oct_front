import React from 'react';
import { Award, GraduationCap, CheckCircle2, Calendar } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

const DoctorSection = ({ onSelectDoctorForBooking }) => {
  const { doctors, loading } = useClinic();

  const handleBookDoctor = (doc) => {
    if (onSelectDoctorForBooking) {
      onSelectDoctorForBooking(doc);
    }
    const element = document.getElementById('book-appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="doctors" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full">
            Clinical Specialists
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 tracking-tight">
            Meet Our Experienced Dental Doctors
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            Our clinic is led by postgraduate MDS dental surgeons committed to clinical precision,
            continuous education, and empathetic, gentle patient care.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {doctors.map((doctor) => (
            <div
              key={doctor._id || doctor.name}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
                {/* Doctor Photo */}
                <div className="sm:col-span-5 relative h-64 sm:h-full bg-slate-100">
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600';
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {doctor.experienceYears}+ Yrs Exp
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{doctor.qualification}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-navy-900">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {doctor.specialization}
                    </p>

                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                      {doctor.bio}
                    </p>

                    {/* Expertise Pills */}
                    <div className="mt-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Areas of Focus:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {doctor.areasOfExpertise?.map((area, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium text-navy-800 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Available Mon–Sat
                    </span>
                    <button
                      onClick={() => handleBookDoctor(doctor)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold transition-all active:scale-95 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span>Consult Doctor</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DoctorSection;
