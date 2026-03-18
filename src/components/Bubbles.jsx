// Bubbles rendered via pure CSS — no GSAP, no JS opacity manipulation
// GSAP timelines on detached DOM elements caused global animation context issues
export default function Bubbles() {
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 8 + (i * 7) % 28,
    left: 5 + (i * 137) % 90,
    delay: (i * 0.7) % 8,
    duration: 7 + (i * 1.3) % 8,
    opacity: 0.08 + (i * 0.03) % 0.18,
  }));

  return (
    <div className="bubbles-container" aria-hidden="true">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            bottom: `-${b.size}px`,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
