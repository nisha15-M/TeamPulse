import React from 'react';

export const Avatar = ({ name = 'User', avatar, size = 'md', status, className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0.5 right-0.5',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  const statusColors = {
    online: 'bg-[#A8C3A0]',
    offline: 'bg-gray-400',
    away: 'bg-[#F0C987]',
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover border border-[#E5DED2]`}
          onError={(e) => {
            // fallback to initials on broken image URL
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div
        className={`${sizeClasses[size]} rounded-full bg-[#E7E1F5] text-[#243447] font-semibold flex items-center justify-center border border-[#E5DED2] ${
          avatar ? 'hidden' : 'flex'
        }`}
      >
        {initials}
      </div>
      {status && (
        <span
          className={`absolute rounded-full ring-2 ring-white ${statusDotSizes[size]} ${statusColors[status] || 'bg-gray-400'}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
