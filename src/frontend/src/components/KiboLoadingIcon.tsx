import React from 'react';

interface KiboLoadingIconProps {
  className?: string;
  size?: number;
}

/**
 * Kibo logo loading icon with animation that draws from yellow section to gray section.
 * Light mode: yellow + dark gray. Dark mode: adjusted for visibility.
 */
export const KiboLoadingIcon: React.FC<KiboLoadingIconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`kibo-loading-icon ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kibo-yellow-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" className="kibo-yellow-stop" />
          <stop offset="100%" stopColor="#FFC107" className="kibo-yellow-stop" />
        </linearGradient>
        <linearGradient id="kibo-gray-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B6B6B" className="kibo-mid-gray-stop" />
          <stop offset="100%" stopColor="#4A4A4A" className="kibo-dark-gray-stop" />
        </linearGradient>
      </defs>
      {/* Yellow section - upper left (animates first) */}
      <path
        fill="url(#kibo-yellow-fill)"
        className="kibo-yellow-path dark:kibo-yellow-path-dark"
        d="M8 8h20v12L18 32H8V8z"
      />
      {/* Mid gray section */}
      <path
        fill="url(#kibo-gray-fill)"
        className="kibo-gray-path dark:kibo-gray-path-dark"
        d="M28 20L18 32h10l10-12H28z"
      />
      {/* Dark gray section */}
      <path
        fill="#4A4A4A"
        className="kibo-dark-path dark:kibo-dark-path-dark"
        d="M28 20h12v12H28V20z"
      />
    </svg>
  );
};
