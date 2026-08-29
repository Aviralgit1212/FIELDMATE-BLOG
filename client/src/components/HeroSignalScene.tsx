/* Cinematic Hybrid: an abstract diagnostic-signal core creates depth in the opening without competing with the title or article text. */
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroSignalScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.innerWidth < 800;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.2 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const root = new THREE.Group();
    root.position.set(compact ? 0.6 : 2.35, compact ? 1.6 : 0.25, 0);
    scene.add(root);

    const cyan = new THREE.Color(0x68e4e8);
    const pale = new THREE.Color(0xd4f8f9);
    const ember = new THREE.Color(0xff8a5b);
    const wireMaterial = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.26, wireframe: true });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(compact ? 1.06 : 1.34, 2), wireMaterial);
    root.add(core);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: pale, transparent: true, opacity: 0.24, wireframe: true });
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(compact ? 1.7 : 2.15, 0.012, 3, 96), ringMaterial);
    outerRing.rotation.set(1.12, 0.35, -0.62);
    root.add(outerRing);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(compact ? 1.38 : 1.72, 0.014, 3, 72), new THREE.MeshBasicMaterial({ color: ember, transparent: true, opacity: 0.3, wireframe: true }));
    innerRing.rotation.set(-0.76, 1.02, 0.2);
    root.add(innerRing);

    const burstGeometry = new THREE.BufferGeometry();
    const burstCount = compact ? 88 : 168;
    const burstPositions = new Float32Array(burstCount * 3);
    for (let index = 0; index < burstCount; index += 1) {
      const radius = 2.5 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      burstPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      burstPositions[index * 3 + 1] = radius * Math.cos(phi);
      burstPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    burstGeometry.setAttribute("position", new THREE.BufferAttribute(burstPositions, 3));
    const burst = new THREE.Points(burstGeometry, new THREE.PointsMaterial({ color: cyan, size: compact ? 0.018 : 0.025, transparent: true, opacity: 0.46, sizeAttenuation: true }));
    root.add(burst);

    const reticle = new THREE.Group();
    const reticleMaterial = new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.42 });
    const corners = [
      [-3.2, 2.3, -0.6, -2.8, 2.3, -0.6, -3.2, 1.9, -0.6],
      [3.2, 2.3, -0.6, 2.8, 2.3, -0.6, 3.2, 1.9, -0.6],
      [-3.2, -2.3, -0.6, -2.8, -2.3, -0.6, -3.2, -1.9, -0.6],
      [3.2, -2.3, -0.6, 2.8, -2.3, -0.6, 3.2, -1.9, -0.6],
    ];
    corners.forEach((corner) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(corner, 3));
      reticle.add(new THREE.Line(geometry, reticleMaterial));
    });
    root.add(reticle);

    let scrollValue = 0;
    let frame = 0;
    const render = () => renderer.render(scene, camera);
    const updateScroll = () => { scrollValue = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.6); };
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.2 : 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const animate = () => {
      core.rotation.x += 0.0017;
      core.rotation.y -= 0.0024;
      outerRing.rotation.z += 0.0014;
      innerRing.rotation.x -= 0.002;
      burst.rotation.y += 0.0008;
      root.position.y = (compact ? 1.6 : 0.25) + scrollValue * 0.72;
      root.rotation.z = scrollValue * -0.35;
      camera.position.z = 9 - Math.min(scrollValue, 1) * 0.85;
      camera.lookAt(root.position);
      render();
      frame = requestAnimationFrame(animate);
    };
    const preferenceChanged = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion.matches) render(); else animate();
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize);
    reduceMotion.addEventListener("change", preferenceChanged);
    updateScroll();
    if (reduceMotion.matches) render(); else animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      reduceMotion.removeEventListener("change", preferenceChanged);
      core.geometry.dispose();
      wireMaterial.dispose();
      outerRing.geometry.dispose();
      ringMaterial.dispose();
      innerRing.geometry.dispose();
      (innerRing.material as THREE.Material).dispose();
      burstGeometry.dispose();
      (burst.material as THREE.Material).dispose();
      reticle.traverse((child) => {
        if (child instanceof THREE.Line) child.geometry.dispose();
      });
      reticleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="hero-signal-scene" ref={canvasRef} aria-hidden="true" />;
}
