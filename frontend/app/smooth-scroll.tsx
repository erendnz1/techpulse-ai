"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
  return;
}
    const lenis = new Lenis({
      duration: 0.2,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, [pathname]);
  return null;
}