/* Visual Resolution / Scene-first motion: GSAP owns scene pinning, camera states, and content choreography. */
import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SceneName = "origin" | "vision" | "diagnosis" | "memory" | "voice" | "horizon";
const sceneOrder: SceneName[] = ["origin", "vision", "diagnosis", "memory", "voice", "horizon"];

function publishScene(from: SceneName, to: SceneName, progress: number, overall: number) {
  const detail = { from, to, progress: Math.max(0, Math.min(1, progress)), overall };
  window.dispatchEvent(new CustomEvent("fieldmate:scene", { detail }));
  document.documentElement.dataset.storyState = detail.progress < 0.5 ? from : to;
}

export default function CinematicScrollController() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    if (reduced.matches || compact.matches) {
      document.documentElement.dataset.storyState = "origin";
      return;
    }

    document.documentElement.classList.add("cinematic-scroll-ready");
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.86, smoothWheel: true, syncTouch: false });
    const sync = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", sync);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const origin = document.querySelector<HTMLElement>(".origin-pinned-stage");
      if (origin) {
        const title = origin.querySelector<HTMLElement>("h1");
        const lead = origin.querySelector<HTMLElement>("h2");
        const prose = origin.querySelector<HTMLElement>(".origin-prose");
        const plate = origin.querySelector<HTMLElement>(".hero-plate");
        const mark = origin.querySelector<HTMLElement>(".hero-instrument-mark");
        const camera = { progress: 0 };
        gsap.timeline({
          scrollTrigger: { trigger: origin, start: "top top", end: "+=180%", pin: true, pinSpacing: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
        })
          .addLabel("boot", 0)
          .to(camera, { progress: 1, ease: "none", onUpdate: () => publishScene("origin", "vision", camera.progress, camera.progress * 0.16) }, "boot")
          .fromTo(mark, { y: 0, opacity: 1 }, { y: -44, opacity: 0, ease: "none" }, 0.38)
          .fromTo(title, { yPercent: 0, opacity: 1, clipPath: "inset(0 0 0 0)" }, { yPercent: -65, opacity: 0, clipPath: "inset(0 0 100% 0)", ease: "none" }, 0.46)
          .fromTo(lead, { xPercent: 0, opacity: 1 }, { xPercent: -28, opacity: 0, ease: "none" }, 0.5)
          .fromTo(prose, { yPercent: 0, opacity: 1 }, { yPercent: 24, opacity: 0, ease: "none" }, 0.56)
          .fromTo(plate, { scale: 1.02, xPercent: 0 }, { scale: 1.17, xPercent: -8, ease: "none" }, 0);
      }

      const stages = gsap.utils.toArray<HTMLElement>(".cinematic-stage");
      stages.forEach((stage, index) => {
        const scene = stage.dataset.storyState as SceneName;
        const prior = sceneOrder[Math.max(0, sceneOrder.indexOf(scene) - 1)];
        const next = sceneOrder[Math.min(sceneOrder.length - 1, sceneOrder.indexOf(scene) + 1)];
        const cue = stage.querySelector<HTMLElement>(".cinematic-stage-cue");
        const headline = stage.querySelector<HTMLElement>(".stage-headline");
        const label = stage.querySelector<HTMLElement>(".stage-name");
        const word = stage.querySelector<HTMLElement>(".scene-word");
        const atmosphere = stage.querySelector<HTMLElement>(".stage-atmosphere");
        const field = stage.querySelector<HTMLElement>(".stage-field-lines");
        const documentSurface = stage.nextElementSibling?.classList.contains("story-document") ? stage.nextElementSibling as HTMLElement : null;
        const reading = documentSurface?.querySelector<HTMLElement>(".story-reading");
        if (!cue) return;

        const camera = { progress: 0 };
        const fromRight = index % 2 === 1;
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: stage, start: "top top", end: "+=220%", pin: true, pinSpacing: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
        });

        timeline
          .addLabel("approach", 0)
          .to(camera, { progress: 0.34, ease: "none", onUpdate: () => publishScene(prior, scene, camera.progress / 0.34, (index + camera.progress) / stages.length) }, "approach")
          .fromTo(atmosphere, { opacity: 0.08, scale: 0.74, rotate: fromRight ? 9 : -9 }, { opacity: 1, scale: 1.04, rotate: 0, ease: "none" }, "approach")
          .fromTo(field, { opacity: 0, scale: 0.72, rotate: fromRight ? 8 : -8 }, { opacity: 1, scale: 1, rotate: 0, ease: "none" }, 0.08)
          .fromTo(word, { xPercent: fromRight ? 38 : -38, opacity: 0 }, { xPercent: fromRight ? -11 : 11, opacity: 1, ease: "none" }, 0.12)
          .fromTo(headline, { xPercent: fromRight ? 56 : -56, yPercent: 44, opacity: 0, clipPath: "inset(0 100% 0 0)" }, { xPercent: 0, yPercent: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", ease: "none" }, 0.18)
          .fromTo(label, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none" }, 0.23)
          .addLabel("hold", 0.4)
          .to(camera, { progress: 0.62, ease: "none", onUpdate: () => publishScene(scene, scene, 0, (index + camera.progress) / stages.length) }, "hold")
          .addLabel("release", 0.66)
          .to(camera, { progress: 1, ease: "none", onUpdate: () => publishScene(scene, next, (camera.progress - 0.62) / 0.38, (index + camera.progress) / stages.length) }, "release")
          .to(headline, { xPercent: fromRight ? -28 : 28, yPercent: -36, opacity: 0, clipPath: "inset(100% 0 0 0)", ease: "none" }, "release")
          .to(label, { yPercent: 82, opacity: 0, ease: "none" }, 0.74)
          .to([word, field], { opacity: 0, ease: "none" }, 0.78)
          .to(atmosphere, { opacity: 0, scale: 1.22, ease: "none" }, 0.8);

        if (reading && documentSurface) {
          gsap.fromTo(reading, { xPercent: fromRight ? 34 : -34, y: 108, opacity: 0, filter: "blur(10px)" }, {
            xPercent: 0, y: 0, opacity: 1, filter: "blur(0px)", ease: "power3.out",
            scrollTrigger: { trigger: documentSurface, start: "top 78%", end: "top 38%", scrub: 0.7, invalidateOnRefresh: true },
          });
          gsap.to(reading, {
            y: -52, opacity: 0.12, filter: "blur(4px)", ease: "none",
            scrollTrigger: { trigger: documentSurface, start: "bottom 58%", end: "bottom 8%", scrub: true, invalidateOnRefresh: true },
          });
        }
      });

      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
      gsap.ticker.remove(tick);
      lenis.off("scroll", sync);
      lenis.destroy();
      document.documentElement.classList.remove("cinematic-scroll-ready");
      delete document.documentElement.dataset.storyState;
    };
  }, []);

  return null;
}
