/* Deep Field Console: ambient signal geometry stays beneath the opaque reading surface and only responds as slowly as a background instrument. */
import { useEffect, useRef } from "react";
import * as THREE from "three";

type NodeState = { x: number; y: number; z: number; vx: number; vy: number };

export default function SignalNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isCompact = window.innerWidth < 800;
    const nodeCount = isCompact ? 34 : 72;
    const linePairs = isCompact ? 42 : 118;
    const nodes: NodeState[] = Array.from({ length: nodeCount }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 5,
      vx: (Math.random() - 0.5) * 0.0022,
      vy: (Math.random() - 0.5) * 0.0016,
    }));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompact ? 1.2 : 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const pointPositions = new Float32Array(nodeCount * 3);
    const pointGeometry = new THREE.BufferGeometry();
    nodes.forEach((node, index) => {
      pointPositions[index * 3] = node.x;
      pointPositions[index * 3 + 1] = node.y;
      pointPositions[index * 3 + 2] = node.z;
    });
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({ color: 0x68e4e8, size: isCompact ? 0.035 : 0.028, transparent: true, opacity: 0.28, sizeAttenuation: true }),
    );
    scene.add(points);

    const pairs = Array.from({ length: linePairs }, (_, index) => [index % nodeCount, (index * 7 + 13) % nodeCount]);
    const linePositions = new Float32Array(linePairs * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0x68e4e8, transparent: true, opacity: 0.085, depthWrite: false }),
    );
    scene.add(lines);

    const drawLines = () => {
      pairs.forEach(([from, to], index) => {
        const left = nodes[from];
        const right = nodes[to];
        const offset = index * 6;
        linePositions[offset] = left.x;
        linePositions[offset + 1] = left.y;
        linePositions[offset + 2] = left.z;
        linePositions[offset + 3] = right.x;
        linePositions[offset + 4] = right.y;
        linePositions[offset + 5] = right.z;
      });
      lineGeometry.attributes.position.needsUpdate = true;
    };
    drawLines();

    let scrollProgress = 0;
    let frameId = 0;
    const onScroll = () => {
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgress = window.scrollY / total;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 800 ? 1.2 : 1.7));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const renderStatic = () => {
      drawLines();
      renderer.render(scene, camera);
    };

    const animate = () => {
      nodes.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;
        if (Math.abs(node.x) > 8) node.vx *= -1;
        if (Math.abs(node.y) > 6) node.vy *= -1;
        pointPositions[index * 3] = node.x;
        pointPositions[index * 3 + 1] = node.y;
        pointPositions[index * 3 + 2] = node.z;
      });
      pointGeometry.attributes.position.needsUpdate = true;
      drawLines();
      camera.position.y += ((scrollProgress - 0.5) * -2.1 - camera.position.y) * 0.018;
      camera.position.x += (Math.sin(scrollProgress * Math.PI * 1.8) * 0.65 - camera.position.x) * 0.012;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    if (reducedMotion.matches) renderStatic(); else animate();

    const updateMotionPreference = () => {
      cancelAnimationFrame(frameId);
      if (reducedMotion.matches) renderStatic(); else animate();
    };
    reducedMotion.addEventListener("change", updateMotionPreference);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", updateMotionPreference);
      pointGeometry.dispose();
      lineGeometry.dispose();
      (points.material as THREE.Material).dispose();
      (lines.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="signal-network" ref={canvasRef} aria-hidden="true" />;
}
