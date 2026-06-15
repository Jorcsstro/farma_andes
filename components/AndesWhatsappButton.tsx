import { farmacia } from "@/data/site";
import styles from "@/components/AndesInternal.module.css";

export const WHATSAPP_NUMBER = farmacia.whatsapp || "56900000000";

type AndesWhatsappButtonProps = {
  label?: string;
  message: string;
};

export function buildWhatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function AndesWhatsappButton({
  label = "Consultar por WhatsApp",
  message
}: AndesWhatsappButtonProps) {
  return (
    <a className={styles.whatsapp} href={buildWhatsappUrl(message)} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}
