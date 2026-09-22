"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
export function Motion() {
  const mounted = useRef(false);
  useEffect(() => {
    if (
      mounted.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    mounted.current = true;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.05, anchors: true });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {
      gsap.from(".hero-reveal", {
        y: 42,
        opacity: 0,
        duration: 1.3,
        stagger: 0.14,
        ease: "power3.out",
      });
      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((el) =>
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 93%", once: true },
          }),
        );
      gsap.to(".hero-art .art-object", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
    return () => {
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
      mounted.current = false;
    };
  }, []);
  return null;
}
