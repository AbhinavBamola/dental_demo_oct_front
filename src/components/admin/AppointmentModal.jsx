import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CheckCheck,
  MessageCircle,
  FileText,
  Save,
  Edit,
  IndianRupee,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { adminUpdateAppointmentDetails, adminUpdateAppointmentStatus, getErrorMessage } from '../../services/api';

const AppointmentModal = ({ appointment, isOpen, onClose, onStatusUpdated }) => {
  if (!isOpen || !appointment) return null;

  // Editable Form States
  const [appointmentDate, setAppointmentDate] = useState(appointment.appointmentDate || '');
  const [appointmentTime, setAppointmentTime] = useState(appointment.appointmentTime || '');
  const [durationMinutes, setDurationMinutes] = useState(
    appointment.durationMinutes || appointment.serviceId?.durationMinutes || 30
  );
  const [customPrice, setCustomPrice] = useState(
    appointment.customPrice !== undefined && appointment.customPrice !== null
      ? appointment.customPrice
      : appointment.serviceId?.priceStartingAt || 500
  );
  const [notes, setNotes] = useState(appointment.notes || '');

  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (appointment) {
      setAppointmentDate(appointment.appointmentDate || '');
      setAppointmentTime(appointment.appointmentTime || '');
      setDurationMinutes(appointment.durationMinutes || appointment.serviceId?.durationMinutes || 30);
      setCustomPrice(
        appointment.customPrice !== undefined && appointment.customPrice !== null
          ? appointment.customPrice
          : appointment.serviceId?.priceStartingAt || 500
      );
      setNotes(appointment.notes || '');
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [appointment]);

  const handleSaveDetails = async (forcedStatus) => {
    try {
      setUpdating(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const targetStatus = forcedStatus || appointment.status;

      const payload = {
        appointmentDate,
        appointmentTime,
        durationMinutes: Number(durationMinutes),
        customPrice: Number(customPrice),
        status: targetStatus,
        notes,
      };

      const res = await adminUpdateAppointmentDetails(appointment._id, payload);
      setSuccessMsg('Appointment details and schedule updated successfully.');
      if (onStatusUpdated) {
        onStatusUpdated(res.data);
      }
    } catch (err) {
      console.error('Failed to update appointment details:', err);
      setErrorMsg(getErrorMessage(err, 'Failed to save appointment changes.'));
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await handleSaveDetails(newStatus);
  };

  // WhatsApp deep link to patient
  const cleanPhone = (appointment.patientPhone || '').replace(/\D/g, '');
  const waMessage = encodeURIComponent(
    `Hello ${appointment.patientName}, this is regarding your dental appointment (${appointment.appointmentId}) for ${
      appointment.serviceId?.name || 'Dental Treatment'
    } at SmileCare Dental Clinic.\n\n` +
      `*Status:* ${appointment.status}\n` +
      `*Scheduled Date:* ${appointmentDate}\n` +
      `*Scheduled Time:* ${appointmentTime} (~${durationMinutes} mins duration)\n\n` +
      `Please reply to confirm or ask any questions.`
  );
  const patientWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-fadeIn"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-navy-900">
                {appointment.appointmentId}
              </h3>
              <StatusBadge status={appointment.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              Submitted on {new Date(appointment.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
            {successMsg}
          </div>
        )}

        {/* Details Grid */}
        <div className="space-y-4 mb-6">
          {/* Patient Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Patient Contact Info
            </span>
            <div className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              <span>{appointment.patientName}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
              <a
                href={`tel:${appointment.patientPhone}`}
                className="flex items-center gap-1.5 hover:text-sky-600 font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>{appointment.patientPhone}</span>
              </a>

              {appointment.patientEmail && (
                <a
                  href={`mailto:${appointment.patientEmail}`}
                  className="flex items-center gap-1.5 hover:text-sky-600 font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>{appointment.patientEmail}</span>
                </a>
              )}
            </div>
          </div>

          {/* Editable Schedule & Treatment Parameters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5 text-sky-600" />
                <span>Edit Schedule & Service Parameters</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Treatment: <strong className="text-navy-900">{appointment.serviceId?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Scheduled Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Scheduled Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50"
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Appointment Time Slot</label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50"
                >
                  {[
                    '09:00 AM',
                    '09:30 AM',
                    '10:00 AM',
                    '10:30 AM',
                    '11:00 AM',
                    '11:30 AM',
                    '12:00 PM',
                    '12:30 PM',
                    '02:00 PM',
                    '02:30 PM',
                    '03:00 PM',
                    '03:30 PM',
                    '04:00 PM',
                    '04:30 PM',
                    '05:00 PM',
                    '05:30 PM',
                    '06:00 PM',
                    '06:30 PM',
                    '07:00 PM',
                  ].map((timeStr) => (
                    <option key={timeStr} value={timeStr}>
                      {timeStr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Treatment Duration */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Treatment Duration (Minutes)
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50"
                >
                  <option value={15}>15 mins (Quick Checkup)</option>
                  <option value={30}>30 mins (Standard Slot)</option>
                  <option value={45}>45 mins (Extended Clean)</option>
                  <option value={60}>60 mins (1 Hour Treatment)</option>
                  <option value={90}>90 mins (1.5 Hours RCT / Surgery)</option>
                  <option value={120}>120 mins (2 Hours Complex Procedure)</option>
                </select>
              </div>

              {/* Service Fee / Pricing */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Treatment Fee (₹ INR)</label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          {appointment.reason && (
            <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-navy-900 font-bold block mb-0.5">Reason for Visit:</strong>
              <p className="text-slate-600">{appointment.reason}</p>
            </div>
          )}

          {/* Clinical / Admin Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Staff & Clinical Notes</span>
              </span>
              <button
                type="button"
                onClick={() => handleSaveDetails()}
                disabled={updating}
                className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </button>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes e.g. adjusted time slot to 60 mins for root canal, patient informed..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900"
            />
          </div>
        </div>

        {/* WhatsApp Patient Action */}
        <div className="mb-6">
          <a
            href={patientWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Patient on WhatsApp (With Updated Schedule)</span>
          </a>
        </div>

        {/* Status Action Buttons */}
        <div className="border-t border-slate-100 pt-4">
          <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
            Confirm & Change Status:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStatusChange('Confirmed')}
              disabled={updating}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold disabled:opacity-40 border border-emerald-200 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm</span>
            </button>

            <button
              onClick={() => handleStatusChange('Completed')}
              disabled={updating}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold disabled:opacity-40 border border-blue-200 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>

            <button
              onClick={() => handleStatusChange('Cancelled')}
              disabled={updating}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold disabled:opacity-40 border border-rose-200 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
