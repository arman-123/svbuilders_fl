/**
 * ShaderCursor — React Three Fiber + GLSL glass-sphere cursor.
 *
 * One fixed viewport-sized R3F canvas (pointer-events:none, z-index 9999).
 * The fragment shader performs real ray-sphere intersection with Phong/Fresnel
 * shading to produce a genuine 3-D glass-ball appearance.
 *
 * GSAP animates `uniforms.uRadius.value` on hover / un-hover.
 * Velocity feeds into the light direction so the specular highlight shifts
 * dynamically as the cursor moves.
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/* ── GLSL ──────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

#define TRAIL 6

uniform vec2  uResolution;
uniform vec2  uCursor;      /* screen coords, top-left origin */
uniform float uRadius;
uniform float uVelX;
uniform float uVelY;
uniform vec2  uTrail[TRAIL];
uniform float uTrailFade[TRAIL];

varying vec2 vUv;

/* Ray-sphere intersection — computes shaded colour for a 3-D glass sphere. */
vec4 glassSphere(vec2 fc, vec2 centre, float r) {
  vec2  p    = fc - centre;
  float d    = length(p);
  if (d > r + 3.0) return vec4(0.0);

  float edge = smoothstep(r + 2.5, r - 0.5, d);

  if (d <= r) {
    /* Surface normal from disc projection */
    float zn = sqrt(max(0.0, 1.0 - (d / r) * (d / r)));
    vec3  N  = normalize(vec3(p / r, zn));

    /* Dynamic light direction — shifts with cursor velocity */
    float vLen  = sqrt(uVelX * uVelX + uVelY * uVelY);
    vec2  vDir  = vLen > 0.5 ? vec2(uVelX, -uVelY) / vLen : vec2(0.0, 1.0);
    vec3  L     = normalize(vec3(-vDir.x * 0.4 + 0.28, vDir.y * 0.3 + 0.65, 0.75));
    vec3  V     = vec3(0.0, 0.0, 1.0);

    float diff    = max(dot(N, L), 0.0);
    vec3  refl    = reflect(-L, N);
    float spec    = pow(max(dot(refl, V), 0.0), 76.0);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    /* Warm dark-brown glass tint — readable on beige backgrounds */
    vec3 gc  = vec3(0.28, 0.21, 0.14);
    vec3 col = gc  * (0.07 + diff * 0.42)
             + vec3(1.0) * spec * 0.92
             + gc  * fresnel * 0.58;

    return vec4(col, (0.60 + fresnel * 0.30) * edge);
  }

  /* Outer glow ring */
  float glow = exp(-(d - r) * 2.8) * 0.18 * edge;
  return vec4(0.28, 0.21, 0.14, glow);
}

void main() {
  /* pixel coords (bottom-left origin in WebGL) */
  vec2 fc  = vUv * uResolution;
  vec2 cur = vec2(uCursor.x, uResolution.y - uCursor.y);

  float alpha = 0.0;
  vec3  color = vec3(0.28, 0.21, 0.14);

  /* Mercury trail dots */
  for (int i = 0; i < TRAIL; i++) {
    float fade = uTrailFade[i];
    if (fade > 0.001) {
      vec2  t = vec2(uTrail[i].x, uResolution.y - uTrail[i].y);
      float r = 7.0 * fade;
      float d = length(fc - t);
      float a = max(0.0, 1.0 - d / max(r, 0.01)) * fade * 0.28;
      alpha   = max(alpha, a);
    }
  }

  /* Primary glass sphere */
  vec4 s = glassSphere(fc, cur, uRadius);
  /* Blend sphere over trail */
  color = mix(color, s.rgb, s.a / max(s.a + 0.0001, 0.0001));
  alpha = max(alpha, s.a);

  gl_FragColor = vec4(color, alpha);
}
`;

/* ── Inner scene component ─────────────────────────────────────────────────── */

function CursorScene() {
  const { size } = useThree();

  /* All uniforms — GSAP tweens directly into these object values. */
  const uniforms = useMemo<Record<string, THREE.IUniform>>(() => ({
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uCursor:     { value: new THREE.Vector2(-400, -400) },
    uRadius:     { value: 22.0 },
    uVelX:       { value: 0.0 },
    uVelY:       { value: 0.0 },
    uTrail: {
      value: Array.from({ length: 6 }, () => new THREE.Vector2(-400, -400)),
    },
    uTrailFade: { value: new Array(6).fill(0.0) },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync resolution on resize */
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  /* Cursor tracking + interaction logic */
  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;

    document.documentElement.classList.add("lux-cursor-enabled");

    const TLEN = 6;
    let mx = -400, my = -400;
    let tx = -400, ty = -400;
    let vx = 0,    vy = 0;
    let tick = 0;
    let rafId = 0;
    const trail = Array.from({ length: TLEN }, () => ({ x: -400, y: -400 }));

    const onMove = (e: MouseEvent) => {
      vx = e.clientX - mx;
      vy = e.clientY - my;
      mx = e.clientX;
      my = e.clientY;
      uniforms.uCursor.value.set(mx, my);
    };

    const render = () => {
      /* Trail lerps behind main cursor */
      tx += (mx - tx) * 0.07;
      ty += (my - ty) * 0.07;

      tick++;
      if (tick % 2 === 0) {
        for (let i = TLEN - 1; i > 0; i--) trail[i] = { ...trail[i - 1] };
        trail[0] = { x: tx, y: ty };
      }

      trail.forEach((t, i) => {
        (uniforms.uTrail.value as THREE.Vector2[])[i].set(t.x, t.y);
        (uniforms.uTrailFade.value as number[])[i] = Math.max(0, 1 - i / TLEN);
      });

      /* Velocity fade */
      uniforms.uVelX.value = vx;
      uniforms.uVelY.value = vy;
      vx *= 0.80;
      vy *= 0.80;

      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    /* GSAP animates uRadius on hover / un-hover */
    const interactiveSel = 'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';
    const onOver = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactiveSel)) {
        gsap.to(uniforms.uRadius, { value: 36, duration: 0.26, ease: "expo.out" });
      }
    };
    const onOut = (e: Event) => {
      if ((e.target as HTMLElement).closest(interactiveSel)) {
        gsap.to(uniforms.uRadius, { value: 22, duration: 0.60, ease: "elastic.out(1, 0.55)" });
      }
    };

    /* Magnetic pull on .btn-fill */
    const cleanups: (() => void)[] = [];
    const setupMag = () => {
      document.querySelectorAll<HTMLElement>(
        ".btn-fill:not([data-mag-init]),[data-magnetic]:not([data-mag-init])"
      ).forEach(el => {
        el.dataset.magInit = "1";
        const onMM = (e: MouseEvent) => {
          const r  = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top  + r.height / 2);
          const d  = Math.sqrt(dx * dx + dy * dy);
          const radius = Math.max(r.width, r.height) * 0.9;
          if (d < radius) {
            const pull = (1 - d / radius) * 0.32;
            el.style.transform  = `translate(${dx * pull}px, ${dy * pull}px)`;
            el.style.transition = "transform 0.12s ease";
          }
        };
        const onML = () => {
          el.style.transform  = "";
          el.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
        };
        el.addEventListener("mousemove",  onMM);
        el.addEventListener("mouseleave", onML);
        cleanups.push(() => {
          el.removeEventListener("mousemove",  onMM);
          el.removeEventListener("mouseleave", onML);
        });
      });
    };
    setupMag();
    const magTimer = setInterval(setupMag, 1800);

    window.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(magTimer);
      cleanups.forEach(fn => fn());
      window.removeEventListener("mousemove",   onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.documentElement.classList.remove("lux-cursor-enabled");
    };
  }, [uniforms]);

  return (
    <mesh>
      {/* 2×2 plane in NDC — fills the viewport exactly with the bypass vertex shader */}
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

export default function ShaderCursor() {
  return (
    <Canvas
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
      gl={{ alpha: true, premultipliedAlpha: false, antialias: false }}
      orthographic
      camera={{ position: [0, 0, 1], near: -1, far: 1 }}
      frameloop="always"
    >
      <CursorScene />
    </Canvas>
  );
}
