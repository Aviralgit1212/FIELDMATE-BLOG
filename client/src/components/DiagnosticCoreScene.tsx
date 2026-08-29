/* Deep Field Console / Scroll-Cinema: continuous Z-axis camera travel, state interpolation, and a persistent diagnostic core protagonist. */
import { useEffect, useRef } from "react";
import * as THREE from "three";

type StateName = "origin" | "vision" | "diagnosis" | "memory" | "voice" | "horizon";

type StateConfig = {
  color: THREE.Color;
  accent: THREE.Color;
  coreScale: number;
  rootX: number;
  rootY: number;
  rootZ: number;
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  focusX: number;
  focusY: number;
  focusZ: number;
  rotationX: number;
  rotationY: number;
  ring: number;
  shell: number;
  vision: number;
  memory: number;
  voice: number;
  alert: number;
  field: number;
  tunnel: number;
};

const stages: StateName[] = ["origin", "vision", "diagnosis", "memory", "voice", "horizon"];
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothStep = (value: number) => value * value * (3 - 2 * value);
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

export default function DiagnosticCoreScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.innerWidth < 800;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(compact ? 44 : 34, window.innerWidth / window.innerHeight, 0.1, 140);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.1 : 1.65));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const root = new THREE.Group();
    scene.add(root);
    const cyan = new THREE.Color(0x68e4e8);
    const emerald = new THREE.Color(0x8af1cf);
    const blue = new THREE.Color(0x8fc5ff);
    const lilac = new THREE.Color(0xc4b6ff);
    const amber = new THREE.Color(0xff9f6b);

    const shellMaterial = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.13, wireframe: true, depthWrite: false });
    const nucleusMaterial = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.44, wireframe: true, depthWrite: false });
    const ringMaterial = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.38, depthWrite: false });
    const accentMaterial = new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0.14, depthWrite: false });
    const visionMaterial = new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0, depthWrite: false });
    const voiceMaterial = new THREE.LineBasicMaterial({ color: emerald, transparent: true, opacity: 0, depthWrite: false });
    const memoryMaterial = new THREE.PointsMaterial({ color: blue, transparent: true, opacity: 0, size: compact ? 0.026 : 0.036, depthWrite: false, sizeAttenuation: true });
    const fieldMaterial = new THREE.PointsMaterial({ color: cyan, transparent: true, opacity: 0.14, size: compact ? 0.018 : 0.026, depthWrite: false, sizeAttenuation: true });
    const tunnelMaterial = new THREE.MeshBasicMaterial({ color: cyan, transparent: true, opacity: 0.07, wireframe: true, depthWrite: false });

    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.05, 2), shellMaterial);
    const nucleus = new THREE.Mesh(new THREE.IcosahedronGeometry(0.94, 2), nucleusMaterial);
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 4, 124), ringMaterial);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.015, 4, 96), accentMaterial);
    ringA.rotation.set(1.08, 0.26, -0.46);
    ringB.rotation.set(-0.76, 1.08, 0.3);
    root.add(shell, nucleus, ringA, ringB);

    const visionFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, 2.25, 1.35)), visionMaterial);
    visionFrame.rotation.set(0.34, -0.64, 0.06);
    root.add(visionFrame);

    const voicePositions = new Float32Array(210 * 3);
    for (let index = 0; index < 210; index += 1) {
      const x = (index / 209 - 0.5) * 7;
      voicePositions[index * 3] = x;
      voicePositions[index * 3 + 1] = Math.sin(index * 0.23) * 0.32;
      voicePositions[index * 3 + 2] = Math.cos(index * 0.12) * 0.25;
    }
    const voiceGeometry = new THREE.BufferGeometry();
    voiceGeometry.setAttribute("position", new THREE.BufferAttribute(voicePositions, 3));
    const voiceWave = new THREE.Line(voiceGeometry, voiceMaterial);
    voiceWave.rotation.set(-0.24, -0.56, 0.12);
    root.add(voiceWave);

    const memoryCount = compact ? 120 : 230;
    const memoryPositions = new Float32Array(memoryCount * 3);
    for (let index = 0; index < memoryCount; index += 1) {
      const radius = 1.7 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      memoryPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      memoryPositions[index * 3 + 1] = radius * Math.cos(phi);
      memoryPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const memoryGeometry = new THREE.BufferGeometry();
    memoryGeometry.setAttribute("position", new THREE.BufferAttribute(memoryPositions, 3));
    const memoryCloud = new THREE.Points(memoryGeometry, memoryMaterial);
    root.add(memoryCloud);

    const alertMaterial = new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0, wireframe: true, depthWrite: false });
    const alert = new THREE.Mesh(new THREE.TorusKnotGeometry(1.16, 0.012, 96, 8), alertMaterial);
    alert.rotation.set(0.7, -0.36, 0.1);
    root.add(alert);

    const fieldCount = compact ? 280 : 620;
    const fieldPositions = new Float32Array(fieldCount * 3);
    for (let index = 0; index < fieldCount; index += 1) {
      fieldPositions[index * 3] = (Math.random() - 0.5) * 44;
      fieldPositions[index * 3 + 1] = (Math.random() - 0.5) * 27;
      fieldPositions[index * 3 + 2] = -3 - Math.random() * 44;
    }
    const fieldGeometry = new THREE.BufferGeometry();
    fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
    const field = new THREE.Points(fieldGeometry, fieldMaterial);
    field.position.z = -3;
    scene.add(field);

    const tunnel = new THREE.Group();
    for (let index = 0; index < 8; index += 1) {
      const contour = new THREE.Mesh(new THREE.TorusGeometry(3.2 + index * 0.65, 0.006, 4, 64), tunnelMaterial.clone());
      contour.position.z = -3.5 - index * 3.6;
      contour.rotation.set(0.38 + index * 0.08, -0.42 + index * 0.12, index * 0.16);
      tunnel.add(contour);
    }
    scene.add(tunnel);

    const stateConfigs: Record<StateName, StateConfig> = {
      origin: { color: cyan, accent: amber, coreScale: 0.94, rootX: compact ? 0.22 : 2.4, rootY: compact ? 0.68 : 0.08, rootZ: 0, cameraX: 0, cameraY: 0, cameraZ: 13.2, focusX: compact ? 0.18 : 1.6, focusY: 0, focusZ: 0, rotationX: 0, rotationY: 0, ring: 0.34, shell: 0.14, vision: 0, memory: 0.06, voice: 0, alert: 0, field: 0.16, tunnel: 0.08 },
      vision: { color: emerald, accent: cyan, coreScale: 0.88, rootX: compact ? 0.05 : 2.66, rootY: compact ? 0.34 : -0.2, rootZ: -1.55, cameraX: compact ? -0.1 : -0.72, cameraY: 0.18, cameraZ: 10.2, focusX: compact ? 0.08 : 1.2, focusY: -0.08, focusZ: -1.5, rotationX: 0.16, rotationY: -0.3, ring: 0.37, shell: 0.12, vision: 0.8, memory: 0.08, voice: 0.02, alert: 0.04, field: 0.23, tunnel: 0.16 },
      diagnosis: { color: amber, accent: cyan, coreScale: 1.08, rootX: compact ? 0.02 : 2.18, rootY: compact ? 0.25 : 0.04, rootZ: -3.9, cameraX: compact ? 0.12 : 0.78, cameraY: -0.22, cameraZ: 7.1, focusX: compact ? 0.04 : 1.35, focusY: 0, focusZ: -3.75, rotationX: -0.14, rotationY: 0.46, ring: 0.54, shell: 0.18, vision: 0.3, memory: 0.16, voice: 0.04, alert: 0.78, field: 0.11, tunnel: 0.29 },
      memory: { color: blue, accent: lilac, coreScale: 0.72, rootX: compact ? 0.08 : 2.94, rootY: compact ? 0.45 : -0.12, rootZ: -6.1, cameraX: compact ? -0.1 : -1.08, cameraY: 0.42, cameraZ: 11.4, focusX: compact ? 0.1 : 1.5, focusY: -0.04, focusZ: -6.0, rotationX: 0.32, rotationY: -0.64, ring: 0.24, shell: 0.07, vision: 0.04, memory: 0.86, voice: 0.06, alert: 0.04, field: 0.38, tunnel: 0.48 },
      voice: { color: emerald, accent: cyan, coreScale: 0.86, rootX: compact ? 0.02 : 2.46, rootY: compact ? 0.3 : 0.22, rootZ: -8.6, cameraX: compact ? 0.08 : 0.64, cameraY: -0.26, cameraZ: 8.3, focusX: compact ? 0.05 : 1.42, focusY: 0.04, focusZ: -8.45, rotationX: -0.18, rotationY: 0.34, ring: 0.28, shell: 0.1, vision: 0.02, memory: 0.25, voice: 0.96, alert: 0.06, field: 0.29, tunnel: 0.34 },
      horizon: { color: lilac, accent: cyan, coreScale: 1.18, rootX: compact ? 0 : 2.7, rootY: compact ? 0.38 : -0.12, rootZ: -11.8, cameraX: compact ? 0 : -0.36, cameraY: 0.2, cameraZ: 12.8, focusX: compact ? 0 : 1.46, focusY: 0, focusZ: -11.6, rotationX: 0.12, rotationY: -0.12, ring: 0.62, shell: 0.22, vision: 0.06, memory: 0.6, voice: 0.28, alert: 0.02, field: 0.18, tunnel: 0.56 },
    };

    let travel: { from: StateName; to: StateName; progress: number; overall: number } = { from: "origin", to: "origin", progress: 0, overall: 0 };
    let frameId = 0;
    const interactive = !compact && !reducedMotion.matches && window.matchMedia("(pointer: fine)").matches;
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    const dragRotation = new THREE.Vector2();
    const dragVelocity = new THREE.Vector2();
    const lastPointer = new THREE.Vector2();
    let dragging = false;
    const focus = new THREE.Vector3();
    const workingColor = new THREE.Color();
    const workingAccent = new THREE.Color();
    const lerp = (from: number, to: number, amount = 0.05) => from + (to - from) * amount;

    const onScene = (event: Event) => {
      const detail = (event as CustomEvent<{ from: StateName; to: StateName; progress: number; overall: number }>).detail;
      if (!detail) return;
      travel = { from: detail.from, to: detail.to, progress: smoothStep(clamp(detail.progress)), overall: clamp(detail.overall) };
    };

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.1 : 1.65));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const render = () => {
      const from = stateConfigs[travel.from];
      const to = stateConfigs[travel.to];
      const progress = reducedMotion.matches ? (travel.progress > 0.5 ? 1 : 0) : travel.progress;
      const value = (key: Exclude<keyof StateConfig, "color" | "accent">) => mix(from[key] as number, to[key] as number, progress);
      workingColor.copy(from.color).lerp(to.color, progress);
      workingAccent.copy(from.accent).lerp(to.accent, progress);

      const drift = reducedMotion.matches ? 0 : Math.sin(performance.now() * 0.00065 + travel.overall * Math.PI * 5) * 0.11;
      if (interactive) {
        pointerCurrent.lerp(pointerTarget, dragging ? 0.15 : 0.055);
        if (!dragging) {
          dragRotation.add(dragVelocity);
          dragVelocity.multiplyScalar(0.91);
        }
      }
      root.position.x = lerp(root.position.x, value("rootX"));
      root.position.y = lerp(root.position.y, value("rootY") + drift);
      root.position.z = lerp(root.position.z, value("rootZ"));
      root.scale.setScalar(lerp(root.scale.x, value("coreScale")));
      root.rotation.x = lerp(root.rotation.x, value("rotationX") + (interactive ? pointerCurrent.y * 0.16 + dragRotation.x : 0));
      root.rotation.y = lerp(root.rotation.y, value("rotationY") + (interactive ? pointerCurrent.x * 0.28 + dragRotation.y : 0));

      camera.position.x = lerp(camera.position.x, value("cameraX") + (interactive ? pointerCurrent.x * 0.22 : 0));
      camera.position.y = lerp(camera.position.y, value("cameraY") + (interactive ? pointerCurrent.y * -0.12 : 0));
      camera.position.z = lerp(camera.position.z, value("cameraZ"));
      focus.set(value("focusX") + (interactive ? pointerCurrent.x * 0.13 : 0), value("focusY") + (interactive ? pointerCurrent.y * -0.08 : 0), value("focusZ"));
      camera.lookAt(focus);
      field.position.x = lerp(field.position.x, interactive ? pointerCurrent.x * -0.72 : 0, 0.04);
      field.position.y = lerp(field.position.y, interactive ? pointerCurrent.y * 0.4 : 0, 0.04);
      tunnel.position.x = lerp(tunnel.position.x, interactive ? pointerCurrent.x * -0.22 : 0, 0.05);

      shellMaterial.color.lerp(workingColor, 0.07); nucleusMaterial.color.lerp(workingColor, 0.07); ringMaterial.color.lerp(workingColor, 0.07); visionMaterial.color.lerp(workingColor, 0.07); memoryMaterial.color.lerp(workingColor, 0.07); voiceMaterial.color.lerp(workingColor, 0.07); fieldMaterial.color.lerp(workingColor, 0.045); tunnel.children.forEach((child) => (child as THREE.Mesh).material && ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.lerp(workingColor, 0.045));
      accentMaterial.color.lerp(workingAccent, 0.07); alertMaterial.color.lerp(workingAccent, 0.07);
      shellMaterial.opacity = lerp(shellMaterial.opacity, value("shell")); nucleusMaterial.opacity = lerp(nucleusMaterial.opacity, value("shell") + 0.3); ringMaterial.opacity = lerp(ringMaterial.opacity, value("ring")); accentMaterial.opacity = lerp(accentMaterial.opacity, value("alert") * 0.52); visionMaterial.opacity = lerp(visionMaterial.opacity, value("vision")); memoryMaterial.opacity = lerp(memoryMaterial.opacity, value("memory")); voiceMaterial.opacity = lerp(voiceMaterial.opacity, value("voice")); alertMaterial.opacity = lerp(alertMaterial.opacity, value("alert")); fieldMaterial.opacity = lerp(fieldMaterial.opacity, value("field"));
      tunnel.children.forEach((child) => { ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = lerp(((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity, value("tunnel") * 0.24); });

      if (!reducedMotion.matches) {
        shell.rotation.x += 0.0012; shell.rotation.y -= 0.0019; nucleus.rotation.x -= 0.0027; nucleus.rotation.z += 0.0018; ringA.rotation.z += 0.0014; ringB.rotation.y -= 0.0017; memoryCloud.rotation.y += 0.001; alert.rotation.x += 0.0023; field.rotation.y += 0.00018; tunnel.rotation.z += 0.00032;
        voiceWave.rotation.z = Math.sin(travel.overall * Math.PI * 10) * 0.32;
        voiceWave.scale.y = 1 + value("voice") * (0.45 + Math.abs(Math.sin(performance.now() * 0.006)) * 0.26);
      }
      renderer.render(scene, camera);
    };

    const animate = () => { render(); frameId = requestAnimationFrame(animate); };
    const motionPreference = () => { cancelAnimationFrame(frameId); if (reducedMotion.matches) render(); else animate(); };
    const onPointerMove = (event: PointerEvent) => {
      if (!interactive) return;
      pointerTarget.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
      if (!dragging) return;
      const deltaX = event.clientX - lastPointer.x;
      const deltaY = event.clientY - lastPointer.y;
      dragRotation.y += deltaX * 0.006;
      dragRotation.x = clamp(dragRotation.x + deltaY * 0.004, -0.56, 0.56);
      dragVelocity.set(deltaY * 0.0018, deltaX * 0.0026);
      lastPointer.set(event.clientX, event.clientY);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!interactive) return;
      dragging = true;
      dragVelocity.set(0, 0);
      lastPointer.set(event.clientX, event.clientY);
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add("is-dragging");
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!interactive) return;
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      canvas.classList.remove("is-dragging");
    };

    window.addEventListener("fieldmate:scene", onScene as EventListener);
    if (interactive) {
      canvas.classList.add("is-interactive");
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);
    }
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", motionPreference);
    if (reducedMotion.matches) render(); else animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("fieldmate:scene", onScene as EventListener);
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", motionPreference);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      delete document.documentElement.dataset.storyState;
      shell.geometry.dispose(); nucleus.geometry.dispose(); ringA.geometry.dispose(); ringB.geometry.dispose(); visionFrame.geometry.dispose(); voiceGeometry.dispose(); memoryGeometry.dispose(); alert.geometry.dispose(); fieldGeometry.dispose();
      shellMaterial.dispose(); nucleusMaterial.dispose(); ringMaterial.dispose(); accentMaterial.dispose(); visionMaterial.dispose(); voiceMaterial.dispose(); memoryMaterial.dispose(); fieldMaterial.dispose(); alertMaterial.dispose(); tunnel.children.forEach((child) => ((child as THREE.Mesh).material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="diagnostic-core-canvas" aria-hidden="true" />;
}
