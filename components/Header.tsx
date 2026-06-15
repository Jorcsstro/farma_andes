import Image from "next/image";
import Link from "next/link";
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

export function Header() {
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
        <Link href="/">Inicio</Link>

        <div className="andes-nav-dropdown">
          <Link href="/productos" className="andes-nav-dropdown-trigger">
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

        <Link href="/vademecum">Vademécum</Link>
        <Link href="/uso-racional-de-medicamentos">Uso racional</Link>
        <Link href="/#nosotros">Nosotros</Link>
        <Link href="/#contacto">Contacto</Link>
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