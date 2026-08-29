/* Cinematic Hybrid: the rail is a quiet, persistent instrument that exposes article position without interrupting the reading flow. */
import { useEffect, useState } from "react";

type SectionLink = { label: string; signal: string };

export default function CinematicRail({ sections }: { sections: SectionLink[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targets = sections
      .map((_, index) => document.getElementById(`section-${index + 1}`))
      .filter((element): element is HTMLElement => Boolean(element));

    const syncProgress = () => {
      const available = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setProgress(window.scrollY / available);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (visible) setActiveIndex(Math.max(targets.indexOf(visible.target as HTMLElement), 0));
      },
      { rootMargin: "-28% 0px -54% 0px", threshold: [0.1, 0.28, 0.5] },
    );
    targets.forEach((target) => observer.observe(target));
    window.addEventListener("scroll", syncProgress, { passive: true });
    syncProgress();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncProgress);
    };
  }, [sections]);

  return (
    <aside className="document-rail" aria-label="Article navigation">
      <a className="rail-brand" href="#top" aria-label="Visual Resolution: return to the top">
        <img className="rail-signal-mark" src="/manus-storage/fieldmate-signal-mark_a407688f.png" alt="" aria-hidden="true" />
        <span>VISUAL<br />RESOLUTION</span>
        <small>VOICE + VISION<br />+ MEMORY</small>
      </a>
      <div className="rail-origin" aria-hidden="true"><span /> <span /> <span /></div>
      <div className="rail-navigation">
        <div className="rail-progress" aria-hidden="true"><i style={{ transform: `scaleY(${Math.max(progress, 0.02)})` }} /></div>
        <nav className="section-nav">
          {sections.map((section, index) => (
            <a key={section.label} href={`#section-${index + 1}`} className={activeIndex === index ? "is-active" : ""} aria-current={activeIndex === index ? "location" : undefined}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{section.signal}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="rail-status"><span className="pulse-dot" /> SIGNAL / {activeIndex === 0 ? "ACTIVE" : "LOCKED"}</div>
      <p className="rail-note">FIELD NOTE<br />01 / 2026</p>
    </aside>
  );
}
