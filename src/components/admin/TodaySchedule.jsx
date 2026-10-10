import React from 'react';
import {
  Clock,
  User,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  XCircle,
  CheckCheck,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const TodaySchedule = ({
  appointments = [],
  onSelectAppointment,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-navy-950">Today's Clinic Schedule</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological order of consultations & procedures for today
          </p>
        </div>
        <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg border border-sky-100">
          {appointments.length} Appointments Today
        </span>
      </div>

      {/* List or Empty State */}
      {appointments.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <Clock className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h4 className="text-sm font-bold text-navy-900">No appointments scheduled for today.</h4>
          <p className="text-xs text-slate-400 mt-1">
            New online booking requests will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {appointments.map((app) => {
            const cleanPhone = (app.patientPhone || '').replace(/\D/g, '');
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${app.patientName}, this is SmileCare Dental Clinic reminding you of your appointment today at ${app.appointmentTime}.`
            )}`;

            return (
              <div
                key={app._id}
                className="p-5 sm:px-6 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Time & Patient */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="px-3 py-2 rounded-xl bg-navy-950 text-white font-mono font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>{app.appointmentTime}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy-900">{app.patientName}</h4>
                      <StatusBadge status={app.status} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700">
                        {app.serviceId?.name || 'General Dentistry'}
                      </span>
                      <span>•</span>
                      <span>{app.doctorId?.name || 'Assigned Doctor'}</span>
                      <span>•</span>
                      <a
                        href={`tel:${app.patientPhone}`}
                        className="flex items-center gap-1 text-sky-600 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{app.patientPhone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Send WhatsApp message"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {app.status === 'Pending' && (
                    <button
                      onClick={() => onStatusChange(app._id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  )}

                  {app.status === 'Confirmed' && (
                    <button
                      onClick={() => onStatusChange(app._id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectAppointment(app)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;
