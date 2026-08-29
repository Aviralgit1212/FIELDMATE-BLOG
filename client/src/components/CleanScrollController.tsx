/* Clean-room cinematic system: every GSAP timeline owns one scene, one release, and one explicit core-state event. */
import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const order = ["origin", "vision", "diagnosis", "memory", "voice", "horizon"] as const;
type Scene = (typeof order)[number];

function signal(scene: Scene, progress: number) {
  const safe = Math.max(0, Math.min(1, progress));
  window.dispatchEvent(new CustomEvent("clean:scene", { detail: { scene, progress: safe } }));
  document.documentElement.dataset.cleanScene = scene;
}

export default function CleanScrollController() {
  useLayoutEffect(() => {
    const compact = window.matchMedia("(max-width: 900px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (compact.matches || reduced.matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.82, smoothWheel: true, syncTouch: false });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("clean-cinematic-active");

    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".clean-scene");
      scenes.forEach((scene, index) => {
        const name = scene.dataset.storyState as Scene;
        const label = scene.querySelector<HTMLElement>(".scene-word");
        const heading = scene.querySelector<HTMLElement>(".stage-headline");
        const tag = scene.querySelector<HTMLElement>(".stage-name");
        const atmosphere = scene.querySelector<HTMLElement>(".stage-atmosphere");
        const lines = scene.querySelector<HTMLElement>(".stage-field-lines");
        const state = { p: 0 };
        const fromRight = index % 2 === 0;

        if (name === "origin") {
          const title = scene.querySelector<HTMLElement>("h1");
          const subtitle = scene.querySelector<HTMLElement>(".origin-copy h2");
          const prose = scene.querySelector<HTMLElement>(".origin-prose");
          const plate = scene.querySelector<HTMLElement>(".hero-plate");
          const intro = gsap.timeline({
            scrollTrigger: { trigger: scene, start: "top top", end: "+=150%", pin: true, pinSpacing: true, scrub: 0.85, anticipatePin: 1, invalidateOnRefresh: true },
          });
          intro
            .to(state, { p: 1, ease: "none", onUpdate: () => signal("origin", state.p) }, 0)
            .to(plate, { scale: 1.12, xPercent: -6, ease: "none" }, 0)
            .to(title, { yPercent: -52, opacity: 0, clipPath: "inset(0 0 100% 0)", ease: "none" }, 0.58)
            .to(subtitle, { xPercent: -22, opacity: 0, ease: "none" }, 0.62)
            .to(prose, { yPercent: 26, opacity: 0, ease: "none" }, 0.66);
          return;
        }

        if (!label || !heading || !tag || !atmosphere || !lines) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: scene, start: "top top", end: "+=170%", pin: true, pinSpacing: true, scrub: 0.85, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.to(state, { p: 1, ease: "none", onUpdate: () => signal(name, state.p) }, 0)
          .fromTo(atmosphere, { opacity: 0.16, scale: 0.78 }, { opacity: 1, scale: 1, ease: "none" }, 0)
          .fromTo(lines, { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, ease: "none" }, 0.08)
          .fromTo(label, { xPercent: fromRight ? 34 : -34, opacity: 0 }, { xPercent: fromRight ? -9 : 9, opacity: 1, ease: "none" }, 0.15)
          .fromTo(heading, { xPercent: fromRight ? 52 : -52, yPercent: 22, opacity: 0, clipPath: "inset(0 100% 0 0)" }, { xPercent: 0, yPercent: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", ease: "none" }, 0.2)
          .fromTo(tag, { y: -42, opacity: 0 }, { y: 0, opacity: 1, ease: "none" }, 0.23)
          .to(heading, { yPercent: -32, opacity: 0, clipPath: "inset(100% 0 0 0)", ease: "none" }, 0.73)
          .to([tag, label, lines], { opacity: 0, ease: "none" }, 0.79)
          .to(atmosphere, { opacity: 0, scale: 1.16, ease: "none" }, 0.82);
      });

      gsap.utils.toArray<HTMLElement>(".clean-document").forEach((documentSurface, index) => {
        const card = documentSurface.querySelector<HTMLElement>(".story-reading");
        if (!card) return;
        gsap.fromTo(card, { x: index % 2 ? -90 : 90, y: 72, opacity: 0, clipPath: "inset(0 0 100% 0)" }, {
          x: 0, y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", ease: "power3.out",
          scrollTrigger: { trigger: documentSurface, start: "top 76%", end: "top 32%", scrub: 0.65, invalidateOnRefresh: true },
        });
      });
      signal("origin", 0);
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.documentElement.classList.remove("clean-cinematic-active");
      delete document.documentElement.dataset.cleanScene;
    };
  }, []);
  return null;
}
