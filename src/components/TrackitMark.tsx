/**
 * TrackitMark — inline SVG logo mark for Trackit.
 * Radar/target with an upward sweep arrow. White + electric blue accents.
 * Sized via className (default 1em); uses currentColor for the outer ring,
 * and the brand accent for the sweep + center dot.
 */
type Props = { className?: string; title?: string };

const TrackitMark = ({ className = "h-5 w-5", title = "Trackit" }: Props) => (
  <svg
    viewBox="0 0 32 32"
    className={className}
    role="img"
    aria-label={title}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* outer ring */}
    <circle cx="16" cy="16" r="12" strokeWidth="1.5" opacity="0.45" />
    {/* mid ring */}
    <circle cx="16" cy="16" r="7.5" strokeWidth="1.5" opacity="0.7" />
    {/* crosshairs */}
    <path d="M16 2v4 M16 26v4 M2 16h4 M26 16h4" strokeWidth="1.25" opacity="0.55" />
    {/* sweep + arrow (accent) */}
    <g style={{ color: "hsl(var(--accent))" }} stroke="currentColor">
      <path d="M16 16 L26 6" strokeWidth="2.25" />
      <path d="M21 6 L26 6 L26 11" strokeWidth="2.25" />
    </g>
    {/* center dot */}
    <circle
      cx="16"
      cy="16"
      r="1.75"
      fill="hsl(var(--accent))"
      stroke="none"
    />
  </svg>
);

export default TrackitMark;
