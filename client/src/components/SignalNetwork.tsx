/* Technical editorial atmosphere: a low-opacity, scroll-responsive signal network behind readable document surfaces. */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SignalNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 700px)");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact.matches ? 1 : 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 8;

    const count = compact.matches ? 62 : 126;
    const nodes = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 4,
      vx: (Math.random() - 0.5) * 0.0018,
      vy: (Math.random() - 0.5) * 0.0018,
    }));
    const points = new Float32Array(count * 3);
    const pointGeometry = new THREE.BufferGeometry();
    const pointMaterial = new THREE.PointsMaterial({ color: 0x74e6e2, size: compact.matches ? 0.024 : 0.018, transparent: true, opacity: 0.38, depthWrite: false });
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x5fc3c0, transparent: true, opacity: 0.075, depthWrite: false });
    const pointCloud = new THREE.Points(pointGeometry, pointMaterial);
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(pointCloud, lines);
    let scrollTarget = 0;
    const setScroll = () => { scrollTarget = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); };
    const resize = () => { const { width, height } = canvas.getBoundingClientRect(); renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const updateGeometry = () => {
      const segments: number[] = [];
      nodes.forEach((node, index) => {
        points[index * 3] = node.x; points[index * 3 + 1] = node.y; points[index * 3 + 2] = node.z;
        for (let next = index + 1; next < nodes.length; next += 1) {
          const other = nodes[next]; const dx = node.x - other.x; const dy = node.y - other.y; const dz = node.z - other.z;
          if (dx * dx + dy * dy + dz * dz < 4.6) segments.push(node.x, node.y, node.z, other.x, other.y, other.z);
        }
      });
      pointGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
      lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    };
    let active = true;
    const tick = () => {
      if (!active) return;
      if (!reduced.matches) nodes.forEach((node) => { node.x += node.vx; node.y += node.vy; if (Math.abs(node.x) > 7) node.vx *= -1; if (Math.abs(node.y) > 7) node.vy *= -1; });
      scene.rotation.z += reduced.matches ? 0 : 0.00045;
      scene.rotation.y += (scrollTarget * 0.65 - scene.rotation.y) * 0.022;
      camera.position.y += ((scrollTarget - 0.5) * -1.25 - camera.position.y) * 0.024;
      updateGeometry(); renderer.render(scene, camera); requestAnimationFrame(tick);
    };
    resize(); setScroll(); tick();
    window.addEventListener("resize", resize); window.addEventListener("scroll", setScroll, { passive: true });
    return () => { active = false; window.removeEventListener("resize", resize); window.removeEventListener("scroll", setScroll); pointGeometry.dispose(); lineGeometry.dispose(); pointMaterial.dispose(); lineMaterial.dispose(); renderer.dispose(); };
  }, []);
  return <canvas ref={canvasRef} className="signal-network" aria-hidden="true" />;
}
