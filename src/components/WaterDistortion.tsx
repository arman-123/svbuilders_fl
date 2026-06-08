/**
 * WaterDistortion — React Three Fiber + GLSL water-ripple overlay.
 *
 * Each project image card gets its own R3F canvas (position:absolute, inset:0).
 * The GLSL fragment shader computes expanding ripple rings + continuous hover
 * glow in UV space — no image texture sampling, so no CORS constraint.
 *
 * mix-blend-mode:screen on the wrapper div means black → invisible,
 * cream/white → brightens the underlying photo, simulating light on water.
 *
 * GSAP via ScrollTrigger controls `uHover` fade on card enter/leave.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ── GLSL ─────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  /* Bypass camera matrices: position is already in NDC (-1 to 1). */
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;

#define MAX 8

uniform float uTime;
uniform vec2  uRes;
uniform vec2  uMouse;   /* normalised UV, y flipped to match UV origin */
uniform float uHover;
uniform vec2  uRpos[MAX];
uniform float uRtime[MAX];
uniform int   uRcount;

varying vec2 vUv;

void main() {
  float asp  = uRes.x / uRes.y;
  float ival = 0.0;

  /* Continuous hover glow centred on cursor */
  if (uHover > 0.01) {
    vec2  d    = vec2((vUv.x - uMouse.x) * asp, vUv.y - uMouse.y);
    float glow = exp(-length(d) * 7.0) * 0.15 * uHover;
    ival += glow;
  }

  /* Expanding ripple rings */
  for (int i = 0; i < MAX; i++) {
    if (i < uRcount) {
      float age = uTime - uRtime[i];
      if (age >= 0.0 && age < 2.4) {
        float p    = age / 2.4;
        vec2  d    = vec2((vUv.x - uRpos[i].x) * asp, vUv.y - uRpos[i].y);
        float dist = length(d);

        /* Primary ring */
        float r    = p * 0.52;
        float w    = 0.013 + p * 0.028;
        float ring = exp(-pow((dist - r) / w, 2.0));
        float fade = pow(1.0 - p, 1.5);
        float wave = sin(dist * 48.0 - age * 9.0) * 0.35 + 0.65;
        ival += ring * fade * wave;

        /* Secondary inner ring for depth */
        float r2    = p * 0.20;
        float ring2 = exp(-pow((dist - r2) / (w * 0.7), 2.0));
        ival       += ring2 * fade * 0.26;
      }
    }
  }

  ival = clamp(ival, 0.0, 0.90);

  /* Warm-white highlight — becomes visible on screen blend with dark images */
  vec3 col = vec3(1.0, 0.97, 0.92);
  gl_FragColor = vec4(col * ival, ival * 0.72);
}
`;

/* ── Ripple state ─────────────────────────────────────────────────────────── */

interface Ripple { x: number; y: number; t: number }

/* ── Inner R3F scene ─────────────────────────────────────────────────────── */

function WaterScene({
  outerRef,
}: {
  outerRef: React.RefObject<HTMLDivElement>;
}) {
  const { size } = useThree();
  const t0    = useRef(performance.now() / 1000);
  const state = useRef({
    ripples:     [] as Ripple[],
    hover:       false,
    lastRipple:  0,
  });

  const uniforms = useMemo<Record<string, THREE.IUniform>>(() => ({
    uTime:   { value: 0.0 },
    uRes:    { value: new THREE.Vector2(size.width, size.height) },
    uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
    uHover:  { value: 0.0 },
    uRpos:   { value: Array.from({ length: 8 }, () => new THREE.Vector2(0.5, 0.5)) },
    uRtime:  { value: new Array(8).fill(0.0) },
    uRcount: { value: 0 },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Keep resolution uniform in sync */
  useEffect(() => {
    uniforms.uRes.value.set(size.width, size.height);
  }, [size, uniforms]);

  /* Attach mouse events to the image container (parent of WaterDistortion wrapper) */
  useEffect(() => {
    const container = outerRef.current?.parentElement ?? null;
    if (!container) return;

    const s = state.current;

    const uvFromClient = (clientX: number, clientY: number) => {
      const r = container.getBoundingClientRect();
      return {
        x: (clientX - r.left) / r.width,
        y: 1 - (clientY - r.top) / r.height, // flip y for WebGL UV
      };
    };

    const spawnRipple = (x: number, y: number) => {
      const now = performance.now();
      if (now - s.lastRipple > 50) {
        s.lastRipple = now;
        s.ripples.push({ x, y, t: now / 1000 - t0.current });
        if (s.ripples.length > 8) s.ripples.shift();
      }
    };

    const onMove = (e: MouseEvent) => {
      const uv = uvFromClient(e.clientX, e.clientY);
      uniforms.uMouse.value.set(uv.x, uv.y);
      spawnRipple(uv.x, uv.y);
    };

    const onTouchMove = (e: TouchEvent) => {
      const uv = uvFromClient(e.touches[0].clientX, e.touches[0].clientY);
      uniforms.uMouse.value.set(uv.x, uv.y);
      spawnRipple(uv.x, uv.y);
    };

    const onEnter = () => {
      s.hover = true;
      uniforms.uHover.value = 1.0;
    };
    const onLeave = () => {
      s.hover = false;
      uniforms.uHover.value = 0.0;
    };

    container.addEventListener("mousemove",  onMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchmove",  onTouchMove, { passive: true });
    container.addEventListener("touchstart", onEnter,     { passive: true });
    container.addEventListener("touchend",   onLeave,     { passive: true });

    return () => {
      container.removeEventListener("mousemove",  onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchmove",  onTouchMove);
      container.removeEventListener("touchstart", onEnter);
      container.removeEventListener("touchend",   onLeave);
    };
  }, [outerRef, uniforms]);

  /* R3F render loop — update time + ripple uniforms every frame */
  useFrame(() => {
    const t = performance.now() / 1000 - t0.current;
    const s = state.current;

    /* Prune expired ripples */
    s.ripples = s.ripples.filter(r => (t - r.t) < 2.4);

    /* Only write GPU uniforms when there is activity */
    if (!s.hover && s.ripples.length === 0) return;

    uniforms.uTime.value   = t;
    uniforms.uRcount.value = s.ripples.length;
    s.ripples.forEach((r, i) => {
      (uniforms.uRpos.value  as THREE.Vector2[])[i].set(r.x, r.y);
      (uniforms.uRtime.value as number[])[i] = r.t;
    });
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

/* ── Public component ─────────────────────────────────────────────────────── */

export default function WaterDistortion() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        mixBlendMode: "screen",
      }}
    >
      <Canvas
        gl={{ alpha: true, premultipliedAlpha: false, antialias: false }}
        style={{ width: "100%", height: "100%", display: "block" }}
        orthographic
        camera={{ position: [0, 0, 1], near: -1, far: 1 }}
        frameloop="always"
      >
        <WaterScene outerRef={wrapperRef} />
      </Canvas>
    </div>
  );
}
