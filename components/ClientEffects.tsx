"use client";

import { useEffect } from "react";

export function ClientEffects() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          const target = Number(element.dataset.count || 0);
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 42));
          const timer = window.setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              window.clearInterval(timer);
            }
            element.textContent = String(current);
          }, 28);
          countObserver.unobserve(element);
        });
      },
      { threshold: 0.6 }
    );

    document.querySelectorAll("[data-count]").forEach((element) => countObserver.observe(element));

    const tilt = document.querySelector<HTMLElement>("#tiltCard");
    const pointerFine = window.matchMedia("(pointer:fine)").matches;
    const onTiltMove = (event: MouseEvent) => {
      if (!tilt) return;
      const rect = tilt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform = `rotateY(${x * 10 - 8}deg) rotateX(${-y * 8 + 4}deg) translateY(-3px)`;
    };
    const resetTilt = () => {
      if (tilt) tilt.style.transform = "rotateY(-8deg) rotateX(4deg)";
    };

    if (tilt && pointerFine) {
      tilt.addEventListener("mousemove", onTiltMove);
      tilt.addEventListener("mouseleave", resetTilt);
    }

    const magneticButtons = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const cleanupMagnetic = magneticButtons.map((button) => {
      const onMove = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.08}px, ${
          (event.clientY - rect.top - rect.height / 2) * 0.12
        }px)`;
      };
      const onLeave = () => {
        button.style.transform = "";
      };
      button.addEventListener("mousemove", onMove);
      button.addEventListener("mouseleave", onLeave);
      return () => {
        button.removeEventListener("mousemove", onMove);
        button.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
      if (tilt) {
        tilt.removeEventListener("mousemove", onTiltMove);
        tilt.removeEventListener("mouseleave", resetTilt);
      }
      cleanupMagnetic.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
