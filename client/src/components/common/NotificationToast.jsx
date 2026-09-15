import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const NotificationToast = () => {
  const { toast, showToast } = useAppData();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2F855A]" />,
    error: <AlertCircle className="w-5 h-5 text-[#C53030]" />,
    info: <Info className="w-5 h-5 text-[#243447]" />,
  };

  const bgStyles = {
    success: 'bg-[#EDF5EB] border-[#C6F6D5] text-[#22543D]',
    error: 'bg-[#FBE8E8] border-[#F5C6CB] text-[#742A2A]',
    info: 'bg-[#E7E1F5] border-[#D6BCFA] text-[#243447]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-floating max-w-md backdrop-blur-md bg-opacity-95 bg-[#FFFCF8]">
      <div className="flex-shrink-0">{icons[toast.type] || icons.info}</div>
      <div className="flex-1 text-sm font-medium text-[#243447]">{toast.message}</div>
      <button
        onClick={() => showToast('')}
        className="text-[#6B7280] hover:text-[#243447] transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NotificationToast;
