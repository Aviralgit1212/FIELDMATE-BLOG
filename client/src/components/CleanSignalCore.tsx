/* Clean-room signal core: a small scene-local Three.js world, driven only by GSAP scene events. */
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Scene = "origin" | "vision" | "diagnosis" | "memory" | "voice" | "horizon";
const config: Record<Scene, { color: number; camera: [number, number, number]; scale: number; spin: number }> = {
  origin: { color: 0x6ce9e5, camera: [0.9, 0.2, 8.8], scale: 1, spin: 0.22 },
  vision: { color: 0xa2fff0, camera: [2.6, 0.5, 7.1], scale: 1.12, spin: 0.33 },
  diagnosis: { color: 0xff805c, camera: [-2.5, 0.1, 6.2], scale: 1.28, spin: -0.46 },
  memory: { color: 0x78a8ff, camera: [2.1, 1.25, 8.1], scale: 1.03, spin: 0.4 },
  voice: { color: 0x83f5ce, camera: [-1.5, -0.2, 6.8], scale: 1.18, spin: -0.31 },
  horizon: { color: 0xd1c5ff, camera: [0, 0.15, 9.6], scale: 0.94, spin: 0.18 },
};
const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

export default function CleanSignalCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(...config.origin.camera);
    const group = new THREE.Group(); scene.add(group);
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.22, 0.028, 220, 18, 2, 5), new THREE.MeshBasicMaterial({ color: config.origin.color, transparent: true, opacity: 0.72 }));
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.72, 3), new THREE.MeshBasicMaterial({ color: config.origin.color, wireframe: true, transparent: true, opacity: 0.14 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.012, 5, 160), new THREE.MeshBasicMaterial({ color: config.origin.color, transparent: true, opacity: 0.56 }));
    ring.rotation.x = 0.76; ring.rotation.y = -0.42; group.add(knot, shell, ring);
    const positions = new Float32Array(720 * 3); for (let i = 0; i < positions.length; i += 3) { const r = 2.2 + Math.random() * 2.8; const a = Math.random() * Math.PI * 2; const z = (Math.random() - .5) * 2.4; positions[i] = Math.cos(a) * r; positions[i + 1] = Math.sin(a) * r; positions[i + 2] = z; }
    const particles = new THREE.BufferGeometry(); particles.setAttribute("position", new THREE.BufferAttribute(positions, 3)); const points = new THREE.Points(particles, new THREE.PointsMaterial({ color: config.origin.color, size: .018, transparent: true, opacity: .64 })); group.add(points);
    let target: Scene = "origin"; let sceneProgress = 0; let running = true;
    const onScene = (event: Event) => { const detail = (event as CustomEvent<{ scene: Scene; progress: number }>).detail; if (detail) { target = detail.scene; sceneProgress = detail.progress; } };
    const resize = () => { const { width, height } = canvas.getBoundingClientRect(); renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); };
    const clock = new THREE.Clock();
    const loop = () => { if (!running) return; const t = clock.getElapsedTime(); const c = config[target]; camera.position.x = lerp(camera.position.x, c.camera[0], .04); camera.position.y = lerp(camera.position.y, c.camera[1], .04); camera.position.z = lerp(camera.position.z, c.camera[2], .04); camera.lookAt(0, 0, 0); group.scale.setScalar(lerp(group.scale.x, c.scale + sceneProgress * .08, .045)); group.rotation.y += (c.spin * .013 - group.rotation.y * .0015); group.rotation.x = Math.sin(t * .37) * .16; knot.rotation.z += .008 + sceneProgress * .01; shell.rotation.y -= .002; ring.rotation.z += .0025; const color = new THREE.Color(c.color); (knot.material as THREE.MeshBasicMaterial).color.lerp(color, .08); (shell.material as THREE.MeshBasicMaterial).color.lerp(color, .08); (ring.material as THREE.MeshBasicMaterial).color.lerp(color, .08); (points.material as THREE.PointsMaterial).color.lerp(color, .08); renderer.render(scene, camera); requestAnimationFrame(loop); };
    resize(); loop(); window.addEventListener("resize", resize); window.addEventListener("clean:scene", onScene as EventListener);
    return () => { running = false; window.removeEventListener("resize", resize); window.removeEventListener("clean:scene", onScene as EventListener); particles.dispose(); renderer.dispose(); };
  }, []);
  return <canvas ref={canvasRef} className="clean-signal-core" aria-hidden="true" />;
}
