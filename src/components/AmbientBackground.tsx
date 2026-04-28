/**
 * AmbientBackground
 * Fixed, full-viewport, non-interactive layer that renders three slow-drifting
 * radial gradient "blobs" using theme tokens. Sits behind all content.
 */
const AmbientBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Deep blue blob — top left */}
      <div
        className="absolute -top-1/3 -left-1/4 h-[70vw] w-[70vw] rounded-full animate-blob-drift-1 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--accent) / 0.10), transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Soft deep-blue diffusion — bottom right */}
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[75vw] w-[75vw] rounded-full animate-blob-drift-2 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, hsl(220 90% 45% / 0.07), transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      {/* Subtle accent tint — center, very low opacity */}
      <div
        className="absolute top-1/3 left-1/3 h-[55vw] w-[55vw] rounded-full animate-blob-drift-3 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--accent) / 0.05), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Subtle vignette to keep edges calm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
    </div>
  );
};

export default AmbientBackground;
