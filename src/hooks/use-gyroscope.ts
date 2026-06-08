import { useEffect, useRef, useCallback } from "react";

type GyroCallback = (x: number, y: number) => void;

/* Normalises DeviceOrientationEvent beta/gamma to [-0.5, 0.5].
   Falls back to scroll-reactive motion when gyroscope is unavailable.
   Does NOT affect desktop — only wires up on touch devices. */
export function useGyroscope(onMove: GyroCallback, enabled: boolean) {
  const callbackRef = useRef(onMove);
  callbackRef.current = onMove;

  const requestPermission = useCallback(async () => {
    if (!enabled) return;

    // iOS 13+ requires explicit permission
    const DevOri = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DevOri.requestPermission === "function") {
      const permission = await DevOri.requestPermission();
      if (permission !== "granted") return;
    }

    const handler = (e: DeviceOrientationEvent) => {
      // beta = front-back tilt [-180,180], gamma = left-right tilt [-90,90]
      const x = ((e.gamma ?? 0) / 90) * 0.5;   // normalised [-0.5, 0.5]
      const y = ((e.beta  ?? 0) / 90) * 0.25;  // less vertical travel
      callbackRef.current(x, y);
    };

    window.addEventListener("deviceorientation", handler, { passive: true });
    return () => window.removeEventListener("deviceorientation", handler);
  }, [enabled]);

  // Scroll fallback: vertical scroll progress drives a gentle Y shift
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      callbackRef.current(0, (progress - 0.5) * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return { requestPermission };
}
