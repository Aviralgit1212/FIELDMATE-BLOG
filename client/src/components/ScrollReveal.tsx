/* Lightweight scroll reveal: alternates each .article-section in from the left/right
   edge as it enters the viewport, then leaves it alone (unobserve after reveal).
   Deliberately simple — plain IntersectionObserver + CSS transitions, no scroll-linked
   timelines, no pinning, no per-frame work. This is the part that kept breaking in the
   earlier GSAP/pinned-scene attempts (see ideas.md); a one-shot class toggle per section
   can't produce that class of bug. */
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".article-section"));
    if (sections.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sections.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    sections.forEach((el, index) => {
      el.dataset.revealDir = index % 2 === 0 ? "left" : "right";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
