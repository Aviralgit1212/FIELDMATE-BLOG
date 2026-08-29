/* Cinematic Hybrid: chapter transitions act as restrained scene changes, allowing the original article copy to arrive on calmer reading surfaces. */
import { useEffect, useRef, useState } from "react";

type ChapterTransitionProps = {
  number: string;
  label: string;
  state: string;
  variant: "resolution" | "diagnosis" | "architecture" | "voice" | "horizon";
};

export default function ChapterTransition({ number, label, state, variant }: ChapterTransitionProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`chapter-transition${isVisible ? " is-visible" : ""}`} data-variant={variant} ref={sceneRef} aria-hidden="true">
      <div className="chapter-grid" />
      <div className="diagnostic-sweep" />
      <div className="chapter-orbit orbit-one" />
      <div className="chapter-orbit orbit-two" />
      <div className="chapter-copy">
        <span>{number} / {state}</span>
        <strong>{label}</strong>
      </div>
      <div className="chapter-coordinate">X: {number}.240 · Y: SIGNAL · Z: LIVE</div>
    </div>
  );
}
