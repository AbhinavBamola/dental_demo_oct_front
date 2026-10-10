import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { usePatientAuth } from '../../context/PatientAuthContext';
import { fetchSlotAvailability, submitAppointment, getErrorMessage } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AppointmentBooking = ({
  preselectedService = null,
  preselectedDoctor = null,
}) => {
  const { clinic, doctors, services } = useClinic();
  const { patientUser } = usePatientAuth();

  // Wizard Step: 1 = Service, 2 = Date & Slot, 3 = Details, 4 = Review, 5 = Success
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState(patientUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(patientUser?.phone || '');
  const [patientEmail, setPatientEmail] = useState(patientUser?.email || '');
  const [reason, setReason] = useState('Routine Checkup & Consultation');
  const [notes, setNotes] = useState('');

  // Prefill patient data if user logs in during session
  useEffect(() => {
    if (patientUser) {
      if (!patientName) setPatientName(patientUser.name || '');
      if (!patientPhone) setPatientPhone(patientUser.phone || '');
      if (!patientEmail) setPatientEmail(patientUser.email || '');
    }
  }, [patientUser]);

  // Availability State
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [slotsData, setSlotsData] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  // Set default minimum date to today (YYYY-MM-DD)
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };

  const getMaxDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 60); // 60 days in advance
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };

  // Sync pre-selected props if passed
  useEffect(() => {
    if (preselectedService && preselectedService._id) {
      setSelectedServiceId(preselectedService._id);
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedDoctor && preselectedDoctor._id) {
      setSelectedDoctorId(preselectedDoctor._id);
    }
  }, [preselectedDoctor]);

  // If only 1 doctor exists, auto-select
  useEffect(() => {
    if (doctors && doctors.length === 1 && !selectedDoctorId) {
      setSelectedDoctorId(doctors[0]._id);
    }
  }, [doctors, selectedDoctorId]);

  // Set default date to today or tomorrow if not set
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(getTodayStr());
    }
  }, [selectedDate]);

  const lastFetchedDoctorAndDate = useRef({ doctorId: '', date: '' });

  // Fetch real slot availability whenever selectedDoctorId or selectedDate changes
  useEffect(() => {
    const loadAvailability = async () => {
      if (!selectedDoctorId || !selectedDate) return;

      // Only reset selectedSlot if the user actually switched the doctor or changed the date
      if (
        lastFetchedDoctorAndDate.current.doctorId !== selectedDoctorId ||
        lastFetchedDoctorAndDate.current.date !== selectedDate
      ) {
        setSelectedSlot('');
        lastFetchedDoctorAndDate.current = {
          doctorId: selectedDoctorId,
          date: selectedDate,
        };
      }

      try {
        setAvailabilityLoading(true);
        setErrorMsg(null);

        const res = await fetchSlotAvailability(selectedDoctorId, selectedDate, clinic?.clinicId);
        if (res) {
          setSlotsData(res.slots || []);
          setAvailabilityMessage(res.message);
        }
      } catch (err) {
        console.error('Failed to load slots availability:', err);
        setSlotsData([]);
        setErrorMsg(getErrorMessage(err, 'Unable to load real-time slots. Please try another date.'));
      } finally {
        setAvailabilityLoading(false);
      }
    };

    if (selectedDoctorId && selectedDate) {
      loadAvailability();
    }
  }, [selectedDoctorId, selectedDate, clinic?.clinicId]);

  // Selected Entities
  const currentService = services.find((s) => s._id === selectedServiceId);
  const currentDoctor = doctors.find((d) => d._id === selectedDoctorId);

  // Client-side Validation
  const validatePatientDetails = () => {
    if (!patientName.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    const cleanPhone = patientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  // Submission handler
  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!selectedSlot) {
      setErrorMsg('Please select an available appointment time slot before confirming.');
      setCurrentStep(2);
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        clinicId: clinic?.clinicId || 'smilecare-dehradun',
        userId: patientUser?._id || null,
        serviceId: selectedServiceId,
        doctorId: selectedDoctorId,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        reason: reason.trim() || 'General Consultation',
        notes: notes.trim(),
      };

      const result = await submitAppointment(payload);
      setConfirmationData(result);
      setCurrentStep(5); // Step 5 = Confirmation Screen
    } catch (err) {
      console.error('Appointment booking error:', err);
      setErrorMsg(getErrorMessage(err, 'Failed to complete appointment booking. Please check availability.'));
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form to book another
  const handleReset = () => {
    setCurrentStep(1);
    setSelectedSlot('');
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setNotes('');
    setConfirmationData(null);
    setErrorMsg(null);
  };

  // Period grouping for slots
  const morningSlots = slotsData.filter((s) => s.period === 'Morning');
  const afternoonSlots = slotsData.filter((s) => s.period === 'Afternoon');
  const eveningSlots = slotsData.filter((s) => s.period === 'Evening');

  return (
    <section id="book-appointment" className="py-24 bg-gradient-to-b from-white to-sky-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 px-3 py-1 rounded-full">
            Online Booking System
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-3 tracking-tight">
            Schedule Your Dental Appointment
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Choose your treatment, select an available date & time slot, and receive instant confirmation.
          </p>
        </div>

        {/* Wizard Container Card */}
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
          
          {/* Step Progress Bar (Hidden on Success screen) */}
          {currentStep < 5 && (
            <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {[
                  { step: 1, label: 'Service' },
                  { step: 2, label: 'Date & Time' },
                  { step: 3, label: 'Your Details' },
                  { step: 4, label: 'Review' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep === item.step
                          ? 'bg-navy-900 text-white shadow-sm ring-4 ring-navy-900/10'
                          : currentStep > item.step
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentStep > item.step ? '✓' : item.step}
                    </div>
                    <span
                      className={`text-xs font-medium hidden md:inline ${
                        currentStep === item.step ? 'text-navy-900 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.step < 4 && (
                      <div className="w-4 sm:w-8 h-0.5 bg-slate-200 mx-1 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="mx-6 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Step 1: Select Dental Service */}
          {currentStep === 1 && (
            <div className="p-6 sm:p-10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-900">Step 1: Choose Dental Service</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select the treatment or consultation you require:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service._id}
                    onClick={() => {
                      setSelectedServiceId(service._id);
                      setErrorMsg(null);
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start justify-between ${
                      selectedServiceId === service._id
                        ? 'border-navy-900 bg-sky-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="pr-3">
                      <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                      <h4 className="text-sm font-bold text-navy-900 mt-1.5">{service.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {service.shortDescription}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-slate-700">
                        <span>~{service.durationMinutes} mins</span>
                        {service.priceStartingAt && (
                          <span className="text-emerald-700">
                            From ₹{service.priceStartingAt.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                        selectedServiceId === service._id
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedServiceId === service._id && <span className="text-[10px]">✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedServiceId}
                  onClick={() => {
                    // Auto-select the first available doctor (single-doctor clinics)
                    if (doctors.length > 0 && !selectedDoctorId) {
                      setSelectedDoctorId(doctors[0]._id);
                    }
                    setCurrentStep(2); // Go to Date & Time
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-semibold text-sm transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Available Slot */}
          {currentStep === 2 && (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-navy-900">Step 2: Select Date & Time</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose your preferred date and pick an available time slot:
                  </p>
                </div>
                {/* Date Input */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    min={getTodayStr()}
                    max={getMaxDateStr()}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Slot Availability Area */}
              {availabilityLoading ? (
                <div className="py-12">
                  <LoadingSpinner text="Checking live clinic slot availability..." />
                </div>
              ) : availabilityMessage ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-center">
                  <p className="text-sm font-medium">{availabilityMessage}</p>
                  <p className="text-xs mt-1 text-amber-600">Please choose another day.</p>
                </div>
              ) : slotsData.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-600">
                  <p className="text-sm">No appointment slots configured for this date.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Slots Grouping */}
                  {morningSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Morning Slots (09:00 AM – 12:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {morningSlots.map((slot) => {
                          const disabled = !slot.isAvailable;
                          const isSelected = selectedSlot === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setSelectedSlot(slot.time);
                                setErrorMsg(null);
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center relative ${
                                isSelected
                                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                                  : disabled
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                  : 'bg-white text-navy-900 border-slate-200 hover:border-sky-500 hover:bg-sky-50/50'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {slot.isBooked && (
                                <span className="text-[9px] uppercase tracking-wide text-rose-500 font-bold mt-0.5">
                                  Booked
                                </span>
                              )}
                              {slot.isPast && !slot.isBooked && (
                                <span className="text-[9px] uppercase tracking-wide text-slate-400 font-medium mt-0.5">
                                  Passed
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {afternoonSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        <span>Afternoon Slots (12:00 PM – 04:00 PM)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {afternoonSlots.map((slot) => {
                          const disabled = !slot.isAvailable;
                          const isSelected = selectedSlot === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setSelectedSlot(slot.time);
                                setErrorMsg(null);
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                                  : disabled
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                  : 'bg-white text-navy-900 border-slate-200 hover:border-sky-500 hover:bg-sky-50/50'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {slot.isBooked && (
                                <span className="text-[9px] uppercase tracking-wide text-rose-500 font-bold mt-0.5">
                                  Booked
                                </span>
                              )}
                              {slot.isPast && !slot.isBooked && (
                                <span className="text-[9px] uppercase tracking-wide text-slate-400 font-medium mt-0.5">
                                  Passed
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {eveningSlots.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Evening Slots (04:00 PM – 07:30 PM)</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {eveningSlots.map((slot) => {
                          const disabled = !slot.isAvailable;
                          const isSelected = selectedSlot === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setSelectedSlot(slot.time);
                                setErrorMsg(null);
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                                  : disabled
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                                  : 'bg-white text-navy-900 border-slate-200 hover:border-sky-500 hover:bg-sky-50/50'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {slot.isBooked && (
                                <span className="text-[9px] uppercase tracking-wide text-rose-500 font-bold mt-0.5">
                                  Booked
                                </span>
                              )}
                              {slot.isPast && !slot.isBooked && (
                                <span className="text-[9px] uppercase tracking-wide text-slate-400 font-medium mt-0.5">
                                  Passed
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-semibold text-sm transition-all"
                >
                  <span>Enter Patient Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Details */}
          {currentStep === 3 && (
            <div className="p-6 sm:p-10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-900">Step 3: Patient Information</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please provide your contact details for appointment confirmation:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Patient Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900 text-sm text-navy-950"
                  />
                </div>

                {/* Patient Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number (10 digits) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900 text-sm text-navy-950"
                  />
                </div>

                {/* Patient Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address (Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900 text-sm text-navy-950"
                  />
                </div>

                {/* Reason for visit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reason for Visit</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tooth sensitivity or general checkup"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900 text-sm text-navy-950"
                  />
                </div>

                {/* Notes */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Additional Notes / Any medical history (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. High blood pressure, diabetic, or dental anxiety..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900 text-sm text-navy-950 resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validatePatientDetails()) {
                      setCurrentStep(4);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm transition-all"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm Summary */}
          {currentStep === 4 && (
            <div className="p-6 sm:p-10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-navy-900">Step 4: Review & Confirm Appointment</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please review your appointment summary before submitting:
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">
                      Selected Treatment
                    </span>
                    <span className="font-bold text-navy-900 text-base">
                      {currentService?.name || 'General Dentistry'}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Estimated duration: ~{currentService?.durationMinutes} mins
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">
                      Attending Specialist
                    </span>
                    <span className="font-bold text-navy-900 text-base">
                      {currentDoctor?.name || 'Assigned Specialist'}
                    </span>
                    <span className="text-xs text-sky-700 block font-medium">
                      {currentDoctor?.specialization}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-xs text-slate-400 block font-semibold uppercase">
                      Appointment Date & Time
                    </span>
                    <span className="font-bold text-navy-900 text-base">
                      {selectedDate} at {selectedSlot}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-xs text-slate-400 block font-semibold uppercase">
                      Patient Details
                    </span>
                    <span className="font-bold text-navy-900">{patientName}</span>
                    <span className="text-xs text-slate-600 block">Phone: {patientPhone}</span>
                    {patientEmail && (
                      <span className="text-xs text-slate-500 block">Email: {patientEmail}</span>
                    )}
                  </div>
                </div>

                {reason && (
                  <div className="border-t border-slate-200 pt-3 text-xs">
                    <span className="text-slate-400 block font-semibold uppercase">
                      Chief Complaint / Reason
                    </span>
                    <span className="text-slate-700">{reason}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleBookingSubmit}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirming Slot...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation Screen */}
          {currentStep === 5 && confirmationData && (
            <div className="p-8 sm:p-12 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Appointment Request Received
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-950 mt-3">
                  Your Appointment Has Been Submitted!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2">
                  Our clinic reception team has logged your appointment. You will receive a phone or
                  WhatsApp verification shortly.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Appointment ID
                  </span>
                  <span className="font-mono font-bold text-base text-navy-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                    {confirmationData.data?.appointmentId}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-700">
                  <p>
                    <strong className="text-slate-900">Patient:</strong>{' '}
                    {confirmationData.data?.patientName}
                  </p>
                  <p>
                    <strong className="text-slate-900">Service:</strong>{' '}
                    {confirmationData.data?.serviceId?.name || currentService?.name}
                  </p>
                  <p>
                    <strong className="text-slate-900">Doctor:</strong>{' '}
                    {confirmationData.data?.doctorId?.name || currentDoctor?.name}
                  </p>
                  <p>
                    <strong className="text-slate-900">Date & Time:</strong>{' '}
                    {confirmationData.data?.appointmentDate} at{' '}
                    {confirmationData.data?.appointmentTime}
                  </p>
                  <p>
                    <strong className="text-slate-900">Initial Status:</strong>{' '}
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[11px]">
                      Pending Verification
                    </span>
                  </p>
                </div>
              </div>

              {/* Direct Actions: WhatsApp Contact & Reset */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={confirmationData.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Clinic on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Book Another Appointment</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default AppointmentBooking;
