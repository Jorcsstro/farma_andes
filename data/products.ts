import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "paracetamol-andes-500",
    nombre: "Paracetamol 500 mg",
    categoria: "Medicamentos",
    marca: "Genérico",
    descripcionCorta:
      "Analgésico y antipirético de uso habitual. Consulta indicaciones con el equipo de farmacia.",
    precio: 2490,
    stockEstado: "disponible",
    requiereReceta: false,
    destacado: true,
    imagenUrl: "/products/paracetamol.svg",
    formato: "Caja 20 comprimidos"
  },
  {
    id: "ibuprofeno-400",
    nombre: "Ibuprofeno 400 mg",
    categoria: "Medicamentos",
    marca: "Andes Pharma",
    descripcionCorta:
      "Antiinflamatorio para dolores leves a moderados. Verifica compatibilidad antes de comprar.",
    precio: 3490,
    stockEstado: "consultar",
    requiereReceta: false,
    destacado: false,
    imagenUrl: "/products/ibuprofeno.svg",
    formato: "Caja 10 cápsulas"
  },
  {
    id: "protector-kids-fps50",
    nombre: "Rayito de Sol Kids FPS50+",
    categoria: "Protección solar",
    marca: "Rayito de Sol",
    descripcionCorta:
      "Protector solar infantil con alta protección para uso diario y actividades al aire libre.",
    precio: 1990,
    precioAnterior: 3990,
    stockEstado: "disponible",
    requiereReceta: false,
    destacado: true,
    imagenUrl: "/products/solar-kids.svg",
    formato: "Frasco 60 ml"
  },
  {
    id: "hawaiian-after-sun",
    nombre: "After Sun Hawaiian Tropic",
    categoria: "Dermocosmética",
    marca: "Hawaiian Tropic",
    descripcionCorta:
      "Gel post solar de textura ligera para refrescar e hidratar la piel después del sol.",
    precio: 4990,
    precioAnterior: 6990,
    stockEstado: "disponible",
    requiereReceta: false,
    destacado: true,
    imagenUrl: "/products/after-sun.svg",
    formato: "Botella 180 ml"
  },
  {
    id: "leblon-antiox-fps50",
    nombre: "Leblon Antiox FPS50+",
    categoria: "Protección solar",
    marca: "Leblon",
    descripcionCorta:
      "Fotoprotector facial con antioxidantes, acabado cómodo y protección de amplio espectro.",
    precio: 3990,
    precioAnterior: 5990,
    stockEstado: "consultar",
    requiereReceta: false,
    destacado: true,
    imagenUrl: "/products/leblon.svg",
    formato: "Tubo 50 ml"
  },
  {
    id: "suero-oral-familiar",
    nombre: "Suero oral familiar",
    categoria: "Cuidado familiar",
    marca: "Vida Sana",
    descripcionCorta:
      "Sales de rehidratación oral para botiquín familiar. Consulta modo de uso según edad.",
    precio: 1890,
    stockEstado: "agotado",
    requiereReceta: false,
    destacado: false,
    imagenUrl: "/products/suero.svg",
    formato: "Sobre 27,9 g"
  },
  {
    id: "loratadina-10",
    nombre: "Loratadina 10 mg",
    categoria: "Medicamentos",
    marca: "Genérico",
    descripcionCorta:
      "Antialérgico de uso común para síntomas estacionales. Revisa recomendaciones de uso.",
    precio: 2990,
    stockEstado: "disponible",
    requiereReceta: false,
    destacado: false,
    imagenUrl: "/products/loratadina.svg",
    formato: "Caja 10 comprimidos"
  },
  {
    id: "crema-reparadora",
    nombre: "Crema reparadora intensiva",
    categoria: "Dermocosmética",
    marca: "Andes Care",
    descripcionCorta:
      "Hidratación para zonas resecas, manos y cuidado diario de piel sensible.",
    precio: 6290,
    stockEstado: "disponible",
    requiereReceta: false,
    destacado: false,
    imagenUrl: "/products/crema.svg",
    formato: "Tubo 100 ml"
  },
  {
    id: "amoxicilina-clavulanico",
    nombre: "Amoxicilina + ácido clavulánico",
    categoria: "Medicamentos",
    marca: "Laboratorio Biofarma",
    descripcionCorta:
      "Antibiótico sujeto a validación de receta. La disponibilidad debe confirmarse por WhatsApp.",
    precio: 8990,
    stockEstado: "consultar",
    requiereReceta: true,
    destacado: false,
    imagenUrl: "/products/receta.svg",
    formato: "Caja 14 comprimidos"
  },
  {
    id: "alcohol-gel-250",
    nombre: "Alcohol gel 70%",
    categoria: "Higiene",
    marca: "Clean Andes",
    descripcionCorta:
      "Formato práctico para hogar, oficina o mochila. Aroma suave y secado rápido.",
    precio: 2190,
    stockEstado: "disponible",
    requiereReceta: false,
    destacado: false,
    imagenUrl: "/products/alcohol-gel.svg",
    formato: "Botella 250 ml"
  }
];

export const featuredProducts = products.filter((product) => product.destacado);
