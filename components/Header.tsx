"use client";

import { useState } from "react";
import { farmacia } from "@/data/site";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "#catalogo", label: "Inicio" },
  { href: "#medicamentos", label: "Medicamentos" },
  { href: "#cuidado-personal", label: "Cuidado personal" },
  { href: "#salud-bienestar", label: "Salud y bienestar" },
  { href: "#ofertas", label: "Ofertas" }
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12.04 4.25a7.7 7.7 0 0 0-6.55 11.77l-.8 3.01 3.08-.8a7.72 7.72 0 1 0 4.27-13.98Zm0 13.98a6.25 6.25 0 0 1-3.2-.88l-.23-.13-1.82.47.49-1.77-.15-.24a6.26 6.26 0 1 1 4.91 2.55Zm3.45-4.69c-.19-.1-1.12-.55-1.29-.61-.17-.07-.3-.1-.42.09-.13.19-.49.61-.6.74-.11.13-.22.14-.41.05-.19-.1-.8-.29-1.52-.94-.56-.5-.94-1.12-1.05-1.31-.11-.19-.01-.29.08-.39.09-.08.19-.22.29-.33.1-.11.13-.19.19-.32.06-.13.03-.24-.02-.34-.05-.09-.42-1.02-.58-1.39-.15-.37-.31-.32-.42-.33h-.36c-.13 0-.34.05-.52.24-.17.19-.68.66-.68 1.61 0 .95.7 1.87.79 2 .1.13 1.37 2.09 3.32 2.93.46.2.83.32 1.11.41.47.15.89.13 1.22.08.37-.06 1.12-.46 1.28-.9.16-.44.16-.82.11-.9-.05-.08-.17-.13-.36-.22Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.2 18.4a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Zm9.4 0a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9ZM4.1 4.2H2.3V2.8h2.8l1.1 11.1c.1.9.8 1.6 1.7 1.6h9.7c.8 0 1.5-.5 1.7-1.3l1.3-5.6H7.1l-.2-1.5h15.4l-1.7 7.4a3.1 3.1 0 0 1-3 2.4H7.9a3.1 3.1 0 0 1-3.1-2.9L4.1 4.2Z" />
    </svg>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header-shell">
      <div className="container site-nav">
        <a className="site-brand-link" href="#catalogo" aria-label="Farmacia Andes inicio">
          <Logo />
        </a>

        <nav className={`site-nav-links ${isOpen ? "open" : ""}`} aria-label="Navegacion principal">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-nav-actions">
          <a
            className="site-whatsapp-btn"
            href={`https://wa.me/${farmacia.whatsapp}?text=${encodeURIComponent(
              "Hola Farmacia Andes, quiero cotizar un producto."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            Cotizar por WhatsApp
          </a>

          <a className="site-cart-link" href="#medicamentos" aria-label="Ver productos disponibles">
            <CartIcon />
            <span>0</span>
          </a>

          <button
            className="menu-btn"
            type="button"
            aria-label="Abrir menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
}
