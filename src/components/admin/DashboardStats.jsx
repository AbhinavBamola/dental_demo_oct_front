import React from 'react';
import { Calendar, Clock, CheckCircle2, CheckCheck } from 'lucide-react';

const DashboardStats = ({ metrics }) => {
  const statCards = [
    {
      title: "Today's Appointments",
      value: metrics?.todayAppointments ?? 0,
      icon: Calendar,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      subtitle: 'Scheduled for today',
    },
    {
      title: 'Pending Requests',
      value: metrics?.pendingRequests ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      subtitle: 'Action required',
    },
    {
      title: 'Confirmed Appointments',
      value: metrics?.confirmedAppointments ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      subtitle: 'Verified & active',
    },
    {
      title: 'Completed Appointments',
      value: metrics?.completedAppointments ?? 0,
      icon: CheckCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      subtitle: 'Successfully treated',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((stat, idx) => {
        const IconComp = stat.icon;
        return (
          <div
            key={idx}
            className={`p-6 rounded-2xl bg-white border ${stat.borderColor} shadow-soft hover:shadow-card transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div className="text-3xl font-extrabold text-navy-950 mt-1">
                  {stat.value}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {stat.subtitle}
                </span>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center shrink-0`}
              >
                <IconComp className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
