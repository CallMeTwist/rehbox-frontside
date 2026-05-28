import { useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Standard scroll reveal: fades + rises elements matching `selector`
 * within `scope`. No-op (elements stay visible) when reduced motion is on.
 */
export const revealOnScroll = (
  scope: HTMLElement,
  selector = ".reveal",
  opts: { y?: number; stagger?: number; start?: string } = {}
) => {
  if (prefersReducedMotion()) return;
  const { y = 24, stagger = 0, start = "top 86%" } = opts;
  gsap.utils.toArray<Element>(scope.querySelectorAll(selector)).forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, y, duration: 0.6, ease: "power2.out",
      delay: stagger ? i * stagger : 0,
      scrollTrigger: { trigger: el, start, once: true },
    });
  });
};

/** Count-up: animates an element's text from 0 to `value` when scrolled in. */
export const useCountUp = () => {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-countup]");
    const reduced = prefersReducedMotion();
    els.forEach((el) => {
      const target = Number(el.dataset.countup || "0");
      const suffix = el.dataset.suffix || "";
      if (reduced) {
        el.textContent = target + suffix;
        return;
      }
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: target, duration: 1.2, ease: "power2.out",
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
          }),
      });
    });
  }, []);
};
