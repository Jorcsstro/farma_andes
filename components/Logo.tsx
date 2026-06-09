import Image from "next/image";
import { farmacia } from "@/data/site";

type LogoProps = {
  light?: boolean;
};

const LOGO_COLOR = "/identidad-visual/02%20Horizontal%20Color.png";
const LOGO_LIGHT = "/identidad-visual/02%20Horizontal%20Blanco%20Naranjo.png";

export function Logo({ light = false }: LogoProps) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <Image
        className="brand-logo"
        src={light ? LOGO_LIGHT : LOGO_COLOR}
        alt={farmacia.nombre}
        width={280}
        height={70}
        priority={!light}
      />
    </span>
  );
}
