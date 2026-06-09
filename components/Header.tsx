"use client";

import { useState } from "react";
import { farmacia } from "@/data/site";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "#servicios", label: "Servicios" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#horarios", label: "Horarios" },
  { href: "#contacto", label: "Contacto" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="top-bar">
  <div className="container top-bar-inner">
    <div className="top-info-group">
      <a
        className="top-info-item"
        href={farmacia.mapaUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Ver ubicación de Farmacia Andes"
      >
        <span className="top-icon">📍</span>
        <span>{farmacia.direccion}</span>
      </a>

      <span className="top-info-item">
        <span className="top-icon">🕘</span>
        <span>{farmacia.horarioPrincipal}</span>
      </span>
    </div>

    <div className="top-info-group top-info-right">

      <a
        className="top-info-item"
        href="https://www.instagram.com/farmacia_andes_/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram de Farmacia Andes"
      >
        <span className="top-icon">📸</span>
        <span>{farmacia.instagram}</span>
      </a>
    </div>
  </div>
</div>

      <header>
        <div className="container nav">
          <a href="#catalogo" aria-label="Farmacia Andes inicio">
            <Logo />
          </a>

          <nav className={`nav-links ${isOpen ? "open" : ""}`} aria-label="Navegación principal">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="btn btn-primary nav-cta"
            href={`https://wa.me/${farmacia.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Cotizar por WhatsApp
          </a>

          <button
            className="menu-btn"
            type="button"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>
    </>
  );
}
