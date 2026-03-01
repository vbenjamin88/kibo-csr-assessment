/**
 * Kibo loading icon: Kibo logo in center with yellow spinning circle around it.
 */
import { useTheme } from '../hooks/useTheme';

export const KiboLoadingIcon = ({
  className = '',
  size = 48,
}: {
  className?: string;
  size?: number;
}) => {
  const { theme } = useTheme();
  const kiboYellow = '#FDD017';
  const logoSize = Math.round(size * 0.65);
  const logoOffset = (size - logoSize) / 2;
  const logoSrc = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`kibo-loading-icon ${className}`}
      aria-hidden="true"
    >
      {/* Spinning yellow circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 4}
        fill="none"
        stroke={kiboYellow}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${Math.round(size * 1.67)} ${Math.round(size * 0.96)}`}
        className="kibo-loading-circle"
      />
      {/* Kibo logo centered - uses same icon as header/favicon */}
      <image
        href={logoSrc}
        x={logoOffset}
        y={logoOffset}
        width={logoSize}
        height={logoSize}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
};
