import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Farmacia Andes | San Fernando",
  description:
    "Farmacia Andes en San Fernando. Catálogo inicial, medicamentos, dermocosmética, cuidado familiar, ofertas y atención cercana por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div className="andes-site">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}