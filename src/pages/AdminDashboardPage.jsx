import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CalendarDays, ArrowRight } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardStats from '../components/admin/DashboardStats';
import TodaySchedule from '../components/admin/TodaySchedule';
import AppointmentModal from '../components/admin/AppointmentModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  adminGetDashboardStats,
  adminUpdateAppointmentStatus,
  getErrorMessage,
} from '../services/api';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await adminGetDashboardStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setErrorMsg(getErrorMessage(err, 'Failed to fetch dashboard data.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await adminUpdateAppointmentStatus(appointmentId, newStatus);
      // Refresh dashboard stats and schedule
      loadStats();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update appointment status.'));
    }
  };

  const handleModalStatusUpdated = (updatedApp) => {
    setSelectedAppointment(null);
    loadStats();
  };

  return (
    <AdminLayout title="Clinic Overview & Today's Schedule">
      <div className="space-y-8">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Real-time synchronization with dental clinic appointment database
          </p>
          <button
            onClick={loadStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-navy-900 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {loading && !data ? (
          <div className="py-20">
            <LoadingSpinner text="Loading clinic metrics & schedule..." />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <DashboardStats metrics={data?.metrics} />

            {/* Today's Schedule */}
            <div className="space-y-4">
              <TodaySchedule
                appointments={data?.todaySchedule || []}
                onSelectAppointment={(app) => setSelectedAppointment(app)}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Bottom Link to Full Appointments Table */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold">Need to view all historical bookings?</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Filter by status, search by phone number or patient name across all dates.
                </p>
              </div>
              <Link
                to="/admin/appointments"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Go to Appointments Manager</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Appointment Detail Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusUpdated={handleModalStatusUpdated}
      />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
