import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { JarvisState } from '../types';

interface IronMan3DCoreProps {
  state: JarvisState;
  isListening: boolean;
  combatMode?: boolean;
  onClick?: () => void;
  className?: string;
  audioActivity?: number;
}

export const IronMan3DCore: React.FC<IronMan3DCoreProps> = ({
  state,
  isListening,
  combatMode = false,
  onClick,
  className = '',
  audioActivity = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ state, isListening, combatMode, audioActivity });

  // Keep stateRef fresh without re-initializing WebGL scene
  useEffect(() => {
    stateRef.current = { state, isListening, combatMode, audioActivity };
  }, [state, isListening, combatMode, audioActivity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic Materials for Iron Man Color Protocol
    const matCore = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const matOuterMesh = new THREE.MeshBasicMaterial({
      color: 0xff0033,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });
    const matRing1 = new THREE.LineDashedMaterial({
      color: 0xffd700,
      dashSize: 0.3,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const matRing2 = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
    });
    const pMat = new THREE.PointsMaterial({
      size: 0.14,
      color: 0xffd700,
      transparent: true,
      opacity: 0.75,
    });

    const pivotGroup = new THREE.Group();
    const baseScale = Math.min(1.05, Math.max(0.68, width / 550));
    pivotGroup.scale.setScalar(baseScale);
    scene.add(pivotGroup);

    // Core Shapes
    const coreWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2, 0)),
      matCore
    );
    const coreMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.5, 0),
      matOuterMesh
    );
    pivotGroup.add(coreWire);
    pivotGroup.add(coreMesh);

    // Wireframe Globe
    const globeWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(5.8, 24, 24)),
      matRing1
    );
    globeWire.computeLineDistances();
    pivotGroup.add(globeWire);

    // Rings Helper
    function create3DRing(radius: number, material: THREE.Material, dashed = false) {
      const geo = new THREE.EdgesGeometry(new THREE.CircleGeometry(radius, 64));
      const ring = dashed
        ? new THREE.LineSegments(geo, material)
        : new THREE.LineLoop(geo, material);
      if (dashed && 'computeLineDistances' in ring) {
        (ring as THREE.LineSegments).computeLineDistances();
      }
      return ring;
    }

    const ringX = create3DRing(7.4, matRing2);
    const ringY = create3DRing(8.4, matRing1, true);
    ringX.rotation.x = Math.PI / 2.5;
    ringY.rotation.y = Math.PI / 3;
    pivotGroup.add(ringX);
    pivotGroup.add(ringY);

    // Additional Iron Man Gold Equatorial Ring
    const matGoldRing = new THREE.LineBasicMaterial({
      color: 0xffb703,
      transparent: true,
      opacity: 0.6,
    });
    const ringZ = create3DRing(6.6, matGoldRing);
    ringZ.rotation.z = Math.PI / 4;
    pivotGroup.add(ringZ);

    // 800-Particle Field (Embers & Quantum Dust)
    const pCount = 800;
    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pArr[i] = (Math.random() - 0.5) * 44;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Target Colors for Smooth Lerping (Iron Man Red, Gold, White, Carbon)
    const targetColorCore = new THREE.Color(0xffffff);
    const targetColorMesh = new THREE.Color(0xff0033);
    const targetColorRing1 = new THREE.Color(0xffd700);
    const targetColorRing2 = new THREE.Color(0xffffff);
    const targetColorParticles = new THREE.Color(0xffb703);
    let rotSpeed = 0.006;
    let targetScale = baseScale;

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const current = stateRef.current;
      const isListeningNow = current.isListening || current.state === 'listening';
      const isSpeakingNow = current.state === 'speaking';
      const isThinkingNow = current.state === 'thinking' || current.state === 'executing';

      // ==========================================
      // IRON MAN COLOR PROTOCOL (Red, Gold, White)
      // ==========================================
      if (isSpeakingNow) {
        // TALKING: Dynamic Red, Gold, & White fusion with voice pulsation
        targetColorCore.setHex(0xffffff);      // Stark White Core
        targetColorMesh.setHex(0xff0033);      // Crimson Armor Mesh
        targetColorRing1.setHex(0xffd700);     // Pure Stark Gold
        targetColorRing2.setHex(0xffffff);     // White Ring
        targetColorParticles.setHex(0xffb703); // Golden Ember Dust
        rotSpeed = 0.035;
        targetScale = baseScale * (1.0 + (current.audioActivity || 0.15) * 0.1);
      } else if (isListeningNow) {
        // LISTENING: Pure Iron Man Red & Pulsing Gold
        targetColorCore.setHex(0xff0033);      // Crimson Pulse
        targetColorMesh.setHex(0xff0033);      // Arc Red Mesh
        targetColorRing1.setHex(0xffd700);     // Gold Ring
        targetColorRing2.setHex(0xff0033);     // Red Ring
        targetColorParticles.setHex(0xff0033); // Red Particles
        rotSpeed = 0.055;
        targetScale = baseScale * 1.06;
      } else if (isThinkingNow) {
        // PROCESSING: Fast Gold-Red Blitz
        targetColorCore.setHex(0xffd700);      // High Output Gold
        targetColorMesh.setHex(0xff0033);      // Crimson Mesh
        targetColorRing1.setHex(0xff9900);     // Amber Ring
        targetColorRing2.setHex(0xffffff);     // White Ring
        targetColorParticles.setHex(0xffd700); // Gold Stream
        rotSpeed = 0.075;
        targetScale = baseScale * 1.04;
      } else if (current.combatMode) {
        // COMBAT PROTOCOL: Full Aggressive Crimson Red & Titanium Black
        targetColorCore.setHex(0xff0033);
        targetColorMesh.setHex(0xff0033);
        targetColorRing1.setHex(0x880015);
        targetColorRing2.setHex(0xff0033);
        targetColorParticles.setHex(0xff0033);
        rotSpeed = 0.02;
        targetScale = baseScale;
      } else {
        // STANDBY: Elegant Iron Man Gold, Crimson, and Stark White
        targetColorCore.setHex(0xffffff);      // Clean White
        targetColorMesh.setHex(0xff0033);      // Crimson Wireframe
        targetColorRing1.setHex(0xffd700);     // Stark Gold Ring
        targetColorRing2.setHex(0xffffff);     // White Ring
        targetColorParticles.setHex(0xffd700); // Gold Sparkles
        rotSpeed = 0.007;
        targetScale = baseScale;
      }

      // Smooth color lerping (0.05 per frame)
      matCore.color.lerp(targetColorCore, 0.06);
      matOuterMesh.color.lerp(targetColorMesh, 0.06);
      matRing1.color.lerp(targetColorRing1, 0.06);
      matRing2.color.lerp(targetColorRing2, 0.06);
      matGoldRing.color.lerp(targetColorRing1, 0.06);
      pMat.color.lerp(targetColorParticles, 0.06);

      // Smooth scale pulse
      const currentScale = pivotGroup.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
      pivotGroup.scale.setScalar(nextScale);

      // Rotations
      pivotGroup.rotation.y += rotSpeed * 0.55;
      coreWire.rotation.x += rotSpeed * 2.2;
      coreMesh.rotation.y -= rotSpeed * 3.1;
      globeWire.rotation.y += rotSpeed * 0.7;
      ringX.rotation.z -= rotSpeed * 2.0;
      ringY.rotation.x += rotSpeed * 1.6;
      ringZ.rotation.y += rotSpeed * 1.2;
      particles.rotation.y += rotSpeed * 0.35;

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer for responsive layout
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
          const s = Math.min(1.05, Math.max(0.68, newW / 550));
          pivotGroup.scale.setScalar(s);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      matCore.dispose();
      matOuterMesh.dispose();
      matRing1.dispose();
      matRing2.dispose();
      matGoldRing.dispose();
      pMat.dispose();
      pGeo.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      title="HOLOGRAPHIC QUANTUM CORE // CLICK TO ENGAGE VOICE COMMAND"
      className={`relative cursor-pointer select-none transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <div
        ref={mountRef}
        className="w-full h-full min-h-[320px] md:min-h-[380px] lg:min-h-[420px] flex items-center justify-center pointer-events-auto"
      />
    </div>
  );
};
