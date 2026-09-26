import React from 'react';

export default function EmptyIllustration() {
  return (
    <svg
      viewBox="0 0 200 160"
      className="w-48 h-36 mx-auto mb-6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bulletin board */}
      <rect
        x="30"
        y="20"
        width="140"
        height="120"
        rx="2"
        stroke="#8C8577"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
      />

      {/* Pin holes */}
      <circle cx="45" cy="35" r="2" fill="#B5622C" opacity="0.6" />
      <circle cx="155" cy="35" r="2" fill="#B5622C" opacity="0.6" />
      <circle cx="45" cy="125" r="2" fill="#B5622C" opacity="0.6" />
      <circle cx="155" cy="125" r="2" fill="#B5622C" opacity="0.6" />

      {/* Empty note 1 - slightly rotated */}
      <g transform="rotate(-3, 75, 70)">
        <rect x="50" y="50" width="50" height="40" rx="1" fill="#FAF6EE" stroke="#8C8577" strokeWidth="1" />
        <line x1="55" y1="60" x2="90" y2="60" stroke="#8C8577" strokeWidth="0.5" opacity="0.4" />
        <line x1="55" y1="68" x2="85" y2="68" stroke="#8C8577" strokeWidth="0.5" opacity="0.4" />
        <line x1="55" y1="76" x2="80" y2="76" stroke="#8C8577" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Empty note 2 */}
      <g transform="rotate(2, 130, 80)">
        <rect x="108" y="60" width="45" height="35" rx="1" fill="#FAF6EE" stroke="#8C8577" strokeWidth="1" />
        <line x1="113" y1="70" x2="143" y2="70" stroke="#8C8577" strokeWidth="0.5" opacity="0.4" />
        <line x1="113" y1="78" x2="140" y2="78" stroke="#8C8577" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Question mark - hand drawn style */}
      <path
        d="M95 105 C95 100, 100 97, 105 97 C110 97, 113 100, 113 104 C113 108, 108 110, 105 112 L105 116"
        stroke="#566B4F"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="105" cy="122" r="1.5" fill="#566B4F" />

      {/* Small decorative elements */}
      <path d="M35 45 L38 42 L41 45" stroke="#D9A441" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M160 110 L163 107 L166 110" stroke="#D9A441" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
    </svg>
  );
}
