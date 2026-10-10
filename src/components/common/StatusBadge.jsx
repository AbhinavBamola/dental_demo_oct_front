import React from 'react';
import { Clock, CheckCircle2, XCircle, CheckCheck } from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  switch (status) {
    case 'Confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ${sizeClasses[size]}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Confirmed
        </span>
      );
    case 'Completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/20 ${sizeClasses[size]}`}
        >
          <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
          Completed
        </span>
      );
    case 'Cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 ${sizeClasses[size]}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          Cancelled
        </span>
      );
    case 'Pending':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Pending
        </span>
      );
  }
};

export default StatusBadge;
