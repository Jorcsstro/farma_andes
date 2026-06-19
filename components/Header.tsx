"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { farmacia } from "@/data/site";

function buildWhatsappMessage(message: string) {
  const whatsappBaseUrl = farmacia.whatsappUrl.split("?")[0];

  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

const productCategories = [
  { href: "/productos", label: "Todos los productos" },
  { href: "/productos?categoria=medicamentos", label: "Medicamentos" },
  { href: "/productos?categoria=dermocosmetica", label: "Dermocosmética" },
  { href: "/productos?categoria=higiene", label: "Higiene" },
  { href: "/productos?categoria=cuidado-familiar", label: "Cuidado familiar" },
  { href: "/productos?categoria=proteccion-solar", label: "Protección solar" },
  { href: "/productos?categoria=veterinaria", label: "Veterinaria" },
];

const navLinks = [
  { href: "/", label: "Inicio", match: (pathname: string) => pathname === "/" },
  { href: "/vademecum", label: "Vademécum", match: (pathname: string) => pathname.startsWith("/vademecum") },
  {
    href: "/uso-racional-de-medicamentos",
    label: "Uso racional",
    match: (pathname: string) => pathname === "/uso-racional-de-medicamentos"
  },
  { href: "/#contacto", label: "Contacto", match: () => false },
];

function getNavClass(isActive: boolean, className?: string) {
  return [className, isActive ? "is-active" : ""].filter(Boolean).join(" ") || undefined;
}

export function Header() {
  const pathname = usePathname();
  const isProductsActive = pathname.startsWith("/productos");

  return (
    <header className="andes-header">
      <Link
        className="andes-brand"
        href="/"
        aria-label="Farmacia Andes inicio"
      >
        <Image
          src="/identidad-visual/02%20Horizontal%20Blanco%20Naranjo.png"
          alt="Farmacia Andes"
          width={188}
          height={48}
          priority
        />
      </Link>

      <nav className="andes-nav" aria-label="Navegación principal">
        <Link
          href={navLinks[0].href}
          className={getNavClass(navLinks[0].match(pathname))}
          aria-current={navLinks[0].match(pathname) ? "page" : undefined}
        >
          {navLinks[0].label}
        </Link>

        <div className="andes-nav-dropdown">
          <Link
            href="/productos"
            className={getNavClass(isProductsActive, "andes-nav-dropdown-trigger")}
            aria-current={isProductsActive ? "page" : undefined}
          >
            Productos <span aria-hidden="true">⌄</span>
          </Link>

          <div className="andes-nav-dropdown-menu">
            {productCategories.map((category) => (
              <Link key={category.href} href={category.href}>
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        {navLinks.slice(1).map((link) => {
          const isActive = link.match(pathname);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={getNavClass(isActive)}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="andes-header-actions">
        <a
          className="andes-whatsapp-pill"
          href={buildWhatsappMessage(
            "Hola Farmacia Andes, quiero cotizar un producto."
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
          Cotizar por WhatsApp
        </a>
      </div>
    </header>
  );
}
