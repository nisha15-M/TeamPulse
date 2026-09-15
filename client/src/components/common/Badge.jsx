import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const styles = {
    Urgent: 'bg-[#FBE8E8] text-[#C53030] border-[#F5C6CB]',
    High: 'bg-[#FDF0E9] text-[#C05621] border-[#FBD38D]',
    Medium: 'bg-[#FAF5E8] text-[#975A16] border-[#F6E05E]',
    Low: 'bg-[#EDF5EB] text-[#2F855A] border-[#C6F6D5]',
  };

  const currentStyle = styles[priority] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    'To Do': 'bg-[#EFEBF8] text-[#553C9A] border-[#D6BCFA]',
    'In Progress': 'bg-[#FDF0E9] text-[#9C4221] border-[#FBD38D]',
    'Review': 'bg-[#FAF5E8] text-[#7B341E] border-[#FEEBC8]',
    'Completed': 'bg-[#EDF5EB] text-[#22543D] border-[#C6F6D5]',
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentStyle}`}>
      {status}
    </span>
  );
};

export const WorkloadBadge = ({ workload }) => {
  const styles = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Balanced: 'bg-[#EDF5EB] text-[#22543D] border-[#C6F6D5]',
    Available: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const currentStyle = styles[workload] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle}`}>
      {workload === 'High' && '⚠️ Overloaded'}
      {workload === 'Balanced' && '✓ Balanced'}
      {workload === 'Available' && '⚡ Available'}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const styles = {
    Admin: 'bg-[#243447] text-white',
    'Team Leader': 'bg-[#D8A48F] text-[#243447]',
    Member: 'bg-gray-100 text-[#243447]',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
      {role}
    </span>
  );
};
