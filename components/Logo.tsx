import { farmacia } from "@/data/site";

type LogoProps = {
  light?: boolean;
};

export function Logo({ light = false }: LogoProps) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <span className="logo" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 45L25 22l9 13 7-9 13 19H10Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="25" cy="22" r="3" fill="currentColor" />
        </svg>
      </span>
      <span>
        <strong>{farmacia.nombre}</strong>
        <small>{farmacia.subtitulo}</small>
      </span>
    </span>
  );
}
