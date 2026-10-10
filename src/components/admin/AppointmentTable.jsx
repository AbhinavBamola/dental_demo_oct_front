import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Filter,
  Eye,
  MessageCircle,
  Phone,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const AppointmentTable = ({
  appointments = [],
  loading = false,
  onSelectAppointment,
  onFilterChange,
  statusFilter,
  dateFilter,
  searchQuery,
  onSearchChange,
  onResetFilters,
}) => {
  const statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
      {/* Top Filter and Search Bar */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or ID (e.g. SC-2026-1001)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-navy-900 text-xs sm:text-sm text-navy-950"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {statusOptions.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange('status', st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Date Picker Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onFilterChange('date', e.target.value)}
              className="bg-transparent text-xs font-medium text-navy-900 focus:outline-none"
            />
          </div>

          {/* Clear Filters */}
          {(statusFilter !== 'All' || dateFilter || searchQuery) && (
            <button
              onClick={onResetFilters}
              className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              title="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-6">Patient</th>
              <th className="py-3.5 px-6">Phone</th>
              <th className="py-3.5 px-6">Treatment</th>
              <th className="py-3.5 px-6">Doctor</th>
              <th className="py-3.5 px-6">Date & Time</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Loading appointments from database...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <p className="font-semibold text-sm text-navy-900">No appointments found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your search query, status, or date filter.
                  </p>
                </td>
              </tr>
            ) : (
              appointments.map((app) => {
                const cleanPhone = (app.patientPhone || '').replace(/\D/g, '');
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello ${app.patientName}, this is SmileCare Dental Clinic regarding your appointment on ${app.appointmentDate}.`
                )}`;

                return (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectAppointment(app)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-navy-900">
                      {app.appointmentId}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{app.patientName}</div>
                      {app.patientEmail && (
                        <div className="text-[11px] text-slate-400">{app.patientEmail}</div>
                      )}
                    </td>

                    <td className="py-4 px-6 font-medium text-slate-600">
                      <a
                        href={`tel:${app.patientPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-sky-600 hover:underline"
                      >
                        {app.patientPhone}
                      </a>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {app.serviceId?.name || 'General Dentistry'}
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      {app.doctorId?.name || 'Assigned Specialist'}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{app.appointmentDate}</div>
                      <div className="text-[11px] text-sky-700 font-medium">
                        {app.appointmentTime}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp patient"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => onSelectAppointment(app)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          title="View appointment details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {appointments.length} appointments</span>
        <span>Click any row to open patient file & update status</span>
      </div>
    </div>
  );
};

export default AppointmentTable;
