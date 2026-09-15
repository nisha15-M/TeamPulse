import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, badge, color = 'terracotta' }) => {
  const iconColors = {
    terracotta: 'bg-[#FDF0E9] text-[#C05621] border-[#FBD38D]',
    sage: 'bg-[#EDF5EB] text-[#2F855A] border-[#C6F6D5]',
    lavender: 'bg-[#EFEBF8] text-[#553C9A] border-[#D6BCFA]',
    slate: 'bg-[#E7EBF0] text-[#243447] border-[#CBD5E1]',
  };

  return (
    <div className="pulse-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{title}</span>
        <div className={`p-2.5 rounded-xl border ${iconColors[color] || iconColors.terracotta}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold text-[#243447]">{value}</span>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EDF5EB] text-[#22543D]">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-[#6B7280] mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
