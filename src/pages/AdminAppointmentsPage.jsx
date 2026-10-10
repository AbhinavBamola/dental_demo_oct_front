import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AppointmentTable from '../components/admin/AppointmentTable';
import AppointmentModal from '../components/admin/AppointmentModal';
import { adminGetAppointments, getErrorMessage } from '../services/api';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await adminGetAppointments(params);
      setAppointments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setErrorMsg(getErrorMessage(err, 'Failed to fetch appointments.'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFilter, searchQuery]);

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      loadAppointments();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadAppointments]);

  const handleFilterChange = (type, value) => {
    if (type === 'status') setStatusFilter(value);
    if (type === 'date') setDateFilter(value);
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setDateFilter('');
    setSearchQuery('');
  };

  const handleModalStatusUpdated = () => {
    setSelectedAppointment(null);
    loadAppointments();
  };

  return (
    <AdminLayout title="Appointments Management">
      <div className="space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        <AppointmentTable
          appointments={appointments}
          loading={loading}
          onSelectAppointment={(app) => setSelectedAppointment(app)}
          onFilterChange={handleFilterChange}
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetFilters={handleResetFilters}
        />
      </div>

      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusUpdated={handleModalStatusUpdated}
      />
    </AdminLayout>
  );
};

export default AdminAppointmentsPage;
