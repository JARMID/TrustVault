import React from 'react';

export const BeynLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="rotate(45 12 12)">
        <path 
          d="M 5 5 L 19 5 L 19 8 L 8 8 L 8 19 L 5 19 Z" 
          fill="url(#beyn-gradient)" 
        />
        <path 
          d="M 19 19 L 5 19 L 5 16 L 16 16 L 16 5 L 19 5 Z" 
          fill="url(#beyn-gradient)" 
        />
        <circle cx="5" cy="5" r="2.5" fill="#00ebd0" />
        <circle cx="19" cy="19" r="2.5" fill="#00ebd0" />
      </g>
      <defs>
        <linearGradient id="beyn-gradient" x1="5" y1="5" x2="19" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00c6ae" />
          <stop offset="1" stopColor="#00ebd0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
