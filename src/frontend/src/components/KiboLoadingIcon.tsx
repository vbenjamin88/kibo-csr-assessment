/**
 * Kibo loading icon: Kibo logo in center with yellow spinning circle around it.
 */
export const KiboLoadingIcon = ({
  className = '',
  size = 48,
}: {
  className?: string;
  size?: number;
}) => {
  const kiboYellow = '#FDD017';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`kibo-loading-icon ${className}`}
      aria-hidden="true"
    >
      {/* Spinning yellow circle */}
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke={kiboYellow}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="80 46"
        className="kibo-loading-circle"
      />
      {/* Kibo icon centered - scaled to ~50% */}
      <g transform="translate(24, 24) scale(0.5) translate(-24, -24)">
        <path fill={kiboYellow} d="M8 8h20v12L18 32H8V8z" />
        <path fill="#363636" d="M28 20L18 32h10l10-12H28z" className="dark:fill-[#9E9E9E]" />
        <path fill="#666666" d="M28 32 L40 32 L40 44 Z" className="dark:fill-white" />
      </g>
    </svg>
  );
};
