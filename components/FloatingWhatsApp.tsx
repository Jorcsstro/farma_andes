import Image from "next/image";
import { farmacia } from "@/data/site";

export function FloatingWhatsApp() {
  const message = "Hola Farmacia Andes, quiero consultar por disponibilidad de un producto.";
  const whatsappUrl = `${farmacia.whatsappUrl}?text=${encodeURIComponent(message)}`;

  return (
    <a
      className="floating-whatsapp"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
    >
      <Image src="/icons/whatsapp.svg" alt="" width={34} height={34} aria-hidden="true" />
      <span className="sr-only">Consultar por WhatsApp</span>
    </a>
  );
}
