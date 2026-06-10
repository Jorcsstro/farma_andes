"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LOADING_VISIBILITY_DELAY_MS = 1200;

export default function Loading() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, LOADING_VISIBILITY_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <main className="page-state page-state-loading" aria-live="polite">
      <div className="loading-brand">
        <Image
          src="/identidad-visual/04%20Isotipo.png"
          alt=""
          width={82}
          height={82}
          priority
        />
        <span className="sr-only">Cargando Farmacia Andes</span>
        <div className="loading-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}
