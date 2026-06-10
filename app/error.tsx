"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-state page-state-error" role="alert">
      <div>
        <span className="page-state-kicker">Farmacia Andes</span>
        <h1>No pudimos cargar la página</h1>
        <p>Intenta nuevamente o consulta disponibilidad directa por WhatsApp.</p>
        <button type="button" onClick={reset}>
          Reintentar
        </button>
      </div>
    </main>
  );
}
