import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock3,
  MessageCircle,
  PlusCircle,
  LogOut,
  Stethoscope,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { usePatientAuth } from '../context/PatientAuthContext';
import { useClinic } from '../context/ClinicContext';
import { patientGetAppointments, getErrorMessage } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const UserDashboardPage = () => {
  const { clinic } = useClinic();
  const { patientUser, logoutPatient } = usePatientAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState({
    all: [],
    today: [],
    upcoming: [],
    past: [],
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'today', 'upcoming', 'past'

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await patientGetAppointments();
      setAppointmentsData(res);
    } catch (err) {
      console.error('Failed to load patient appointments:', err);
      setErrorMsg(getErrorMessage(err, 'Unable to fetch your appointments.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getDisplayedAppointments = () => {
    switch (activeTab) {
      case 'today':
        return appointmentsData.today;
      case 'upcoming':
        return appointmentsData.upcoming;
      case 'past':
        return appointmentsData.past;
      default:
        return appointmentsData.all;
    }
  };

  const displayedList = getDisplayedAppointments();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Patient Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 to-sky-700 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-navy-900 tracking-tight block leading-tight">
                {clinic?.name || 'SmileCare Dental'}
              </span>
              <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider block">
                Patient Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/#book-appointment"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Link>

            <button
              onClick={() => {
                logoutPatient();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors border border-slate-200"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-white/10 px-3 py-1 rounded-full inline-block mb-3 border border-white/10">
                Patient Dashboard
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {patientUser?.name || 'Patient'}!
              </h1>
              <p className="text-xs sm:text-sm text-sky-100/80 mt-1 max-w-lg">
                Track your appointment status, past dental visits, and upcoming scheduled checkups with {clinic?.name || 'SmileCare'}.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
              <Calendar className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-xl font-extrabold block leading-none">
                  {appointmentsData.all.length}
                </span>
                <span className="text-[11px] text-slate-200 font-medium">Total Bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Content */}
        <div className="space-y-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            {[
              { id: 'all', label: 'All Appointments', count: appointmentsData.all.length },
              { id: 'today', label: "Today's", count: appointmentsData.today.length },
              { id: 'upcoming', label: 'Upcoming / Future', count: appointmentsData.upcoming.length },
              { id: 'past', label: 'Past / History', count: appointmentsData.past.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Appointments Grid */}
          {loading ? (
            <div className="py-16">
              <LoadingSpinner text="Fetching your appointments..." />
            </div>
          ) : errorMsg ? (
            <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={loadData}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          ) : displayedList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-navy-900">No appointments found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'all'
                  ? 'You haven’t booked any appointments yet. Click below to schedule a dental checkup.'
                  : `No appointments matching "${activeTab}" filter.`}
              </p>
              <div className="pt-2">
                <Link
                  to="/#book-appointment"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Book New Appointment</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedList.map((app) => {
                const cleanPhone = (clinic?.whatsapp || '919876543210').replace(/\D/g, '');
                const waText = encodeURIComponent(
                  `Hello ${clinic?.name || 'SmileCare'}, I am inquiring about my appointment ${app.appointmentId} scheduled for ${app.appointmentDate} at ${app.appointmentTime}.`
                );
                const patientWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

                return (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Card Header: ID & Status */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            {app.appointmentId}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(app.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <StatusBadge status={app.status} size="sm" />
                      </div>

                      {/* Main Details */}
                      <div className="pt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold uppercase text-[10px]">
                            Treatment
                          </span>
                          <span className="font-bold text-navy-900 text-sm">
                            {app.serviceId?.name || 'General Dental Treatment'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-semibold uppercase text-[10px]">
                            Attending Doctor
                          </span>
                          <span className="font-semibold text-slate-800">
                            {app.doctorId?.name || 'Assigned Specialist'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                              Date
                            </span>
                            <span className="font-bold text-navy-900 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-sky-600" />
                              <span>{app.appointmentDate}</span>
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                              Time & Duration
                            </span>
                            <span className="font-bold text-navy-900 flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3.5 h-3.5 text-sky-600" />
                              <span>{app.appointmentTime}</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({app.durationMinutes || app.serviceId?.durationMinutes || 30} mins)
                              </span>
                            </span>
                          </div>
                        </div>

                        {app.reason && (
                          <div className="pt-1 text-[11px] text-slate-600">
                            <strong>Reason:</strong> {app.reason}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={patientWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-xs bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Clinic</span>
                      </a>

                      <Link
                        to="/#book-appointment"
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold text-xs"
                      >
                        <span>Book Another</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;
