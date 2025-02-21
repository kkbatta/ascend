import React from 'react';

export const AscendLogo = ({ width = 180, height = 90 }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 400 200" 
    className="logo-svg"
  >
    <defs>
      <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6366F1' }}/>
        <stop offset="100%" style={{ stopColor: '#8B5CF6' }}/>
      </linearGradient>
      <linearGradient id="secondaryGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#EC4899' }}/>
        <stop offset="100%" style={{ stopColor: '#8B5CF6' }}/>
      </linearGradient>
      <linearGradient id="sideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 0.9 }}/>
        <stop offset="100%" style={{ stopColor: '#6366F1', stopOpacity: 0.7 }}/>
      </linearGradient>
    </defs>

    <g transform="translate(40, 100)">
      <path d="M0,0 h40 v40 h-40 Z" fill="url(#primaryGradient)"/>
      <path d="M40,40 v-40 l10,-10 v40 Z" fill="url(#sideGradient)"/>
      <path d="M0,0 l10,-10 h40 l-10,10 Z" fill="url(#secondaryGradient)"/>
      <path d="M30,-30 h40 v70 h-40 Z" fill="url(#primaryGradient)"/>
      <path d="M70,40 v-70 l10,-10 v70 Z" fill="url(#sideGradient)"/>
      <path d="M30,-30 l10,-10 h40 l-10,10 Z" fill="url(#secondaryGradient)"/>
      <path d="M60,-60 h40 v100 h-40 Z" fill="url(#primaryGradient)"/>
      <path d="M100,40 v-100 l10,-10 v100 Z" fill="url(#sideGradient)"/>
      <path d="M60,-60 l10,-10 h40 l-10,10 Z" fill="url(#secondaryGradient)"/>
      <circle cx="20" cy="20" r="3" fill="#EC4899" opacity="0.8"/>
      <circle cx="50" cy="-15" r="3" fill="#EC4899" opacity="0.8"/>
      <circle cx="80" cy="-45" r="3" fill="#EC4899" opacity="0.8"/>
      <line 
        x1="20" y1="20" x2="50" y2="-15" 
        stroke="#EC4899" 
        strokeWidth="2" 
        strokeDasharray="4,4" 
        opacity="0.5"
      />
      <line 
        x1="50" y1="-15" x2="80" y2="-45" 
        stroke="#EC4899" 
        strokeWidth="2" 
        strokeDasharray="4,4" 
        opacity="0.5"
      />
    </g>
    <g transform="translate(200, 100)">
      <text 
        x="0" y="0" 
        fontFamily="Arial, sans-serif" 
        fontSize="48" 
        fontWeight="bold" 
        fill="#4F46E5"
      >
        ELEVATE
      </text>
      <text 
        x="0" y="25" 
        fontFamily="Cinzel, serif" 
        fontSize="20" 
        fontWeight="600" 
        fill="#6B7280"
      >
        Growing Stronger Together
      </text>
    </g>
  </svg>
);