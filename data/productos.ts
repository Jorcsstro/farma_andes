export type AndesProduct = {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  principioActivo: string;
  condicionVenta: string;
  formato: string;
  contenido?: string;
  laboratorio?: string;
  precio?: number;
  imagen: string;
  descripcion: string;
  indicaciones: string;
  advertencias: string;
  conservacion: string;
  bioequivalente?: boolean;
  relacionados: string[];
};

export const categoriasProductos = [
  "Medicamentos",
  "Dermocosmetica",
  "Higiene",
  "Cuidado familiar",
  "Proteccion solar",
  "Veterinaria"
];

export const productos: AndesProduct[] = [
  {
    id: "paracetamol-500-mg",
    slug: "paracetamol-500-mg",
    nombre: "Paracetamol 500 mg",
    categoria: "Medicamentos",
    principioActivo: "Paracetamol",
    condicionVenta: "Venta directa",
    formato: "Comprimidos 500 mg",
    contenido: "20 comprimidos",
    laboratorio: "Chilefarma",
    precio: 1990,
    imagen: "/products/paracetamol.svg",
    descripcion: "Analgesico y antipiretico de uso comun para molestias leves a moderadas.",
    indicaciones: "Puede utilizarse para dolor leve, fiebre y malestar general segun indicacion profesional.",
    advertencias: "Evita superar la dosis recomendada. Consulta si tienes enfermedad hepatica o consumes alcohol regularmente.",
    conservacion: "Mantener en su envase original, protegido de humedad, calor y fuera del alcance de ninos.",
    relacionados: ["ibuprofeno-400-mg", "vitamina-c", "termometro-digital"]
  },
  {
    id: "ibuprofeno-400-mg",
    slug: "ibuprofeno-400-mg",
    nombre: "Ibuprofeno 400 mg",
    categoria: "Medicamentos",
    principioActivo: "Ibuprofeno",
    condicionVenta: "Venta directa",
    formato: "Comprimidos 400 mg",
    contenido: "10 comprimidos",
    laboratorio: "Laboratorio Andes",
    precio: 2490,
    imagen: "/products/ibuprofeno.svg",
    descripcion: "Antiinflamatorio no esteroidal utilizado para dolor e inflamacion.",
    indicaciones: "Uso general en dolor muscular, dental, menstrual o inflamacion leve bajo orientacion adecuada.",
    advertencias: "No usar sin orientacion si tienes gastritis, ulcera, enfermedad renal, anticoagulantes o embarazo.",
    conservacion: "Guardar en lugar seco, a temperatura ambiente y lejos de la luz directa.",
    relacionados: ["paracetamol-500-mg", "diclofenaco-gel", "suero-fisiologico"]
  },
  {
    id: "loratadina-10-mg",
    slug: "loratadina-10-mg",
    nombre: "Loratadina 10 mg",
    categoria: "Medicamentos",
    principioActivo: "Loratadina",
    condicionVenta: "Venta directa",
    formato: "Comprimidos 10 mg",
    contenido: "10 comprimidos",
    laboratorio: "Laboratorio Andes",
    precio: 2290,
    imagen: "/products/loratadina.svg",
    descripcion: "Antihistaminico usado para sintomas de alergia.",
    indicaciones: "Puede ayudar en rinitis alergica, estornudos, picazon y molestias asociadas a alergias.",
    advertencias: "Consulta si los sintomas persisten, si hay dificultad respiratoria o si usas otros medicamentos.",
    conservacion: "Mantener en envase cerrado y protegido de humedad.",
    relacionados: ["suero-fisiologico", "protector-solar-spf-50", "alcohol-gel"]
  },
  {
    id: "protector-solar-spf-50",
    slug: "protector-solar-spf-50",
    nombre: "Protector solar SPF 50",
    categoria: "Proteccion solar",
    principioActivo: "Filtros solares",
    condicionVenta: "Venta directa",
    formato: "Crema o locion SPF 50",
    contenido: "120 ml",
    laboratorio: "Cuidado Andes",
    precio: 8990,
    imagen: "/products/solar-kids.svg",
    descripcion: "Proteccion solar diaria para ayudar a prevenir dano por radiacion UV.",
    indicaciones: "Aplicar antes de exposicion solar y reaplicar durante el dia, especialmente tras sudor o agua.",
    advertencias: "Evita exposicion intensa al sol. En piel sensible, consulta por opciones adecuadas.",
    conservacion: "Mantener cerrado, en lugar fresco y sin exposicion directa al calor.",
    relacionados: ["eucerin-ph5-locion", "alcohol-gel", "termometro-digital"]
  },
  {
    id: "eucerin-ph5-locion",
    slug: "eucerin-ph5-locion",
    nombre: "Eucerin pH5 Locion",
    categoria: "Dermocosmetica",
    principioActivo: "Cuidado dermocosmetico",
    condicionVenta: "Venta directa",
    formato: "Locion corporal",
    contenido: "400 ml",
    laboratorio: "Eucerin",
    precio: 11990,
    imagen: "/products/crema.svg",
    descripcion: "Locion para cuidado e hidratacion de piel sensible.",
    indicaciones: "Uso diario sobre piel limpia y seca, especialmente en piel sensible o reseca.",
    advertencias: "Suspende su uso si aparece irritacion persistente o reaccion alergica.",
    conservacion: "Guardar cerrado, a temperatura ambiente y lejos del sol directo.",
    relacionados: ["protector-solar-spf-50", "alcohol-gel", "suero-fisiologico"]
  },
  {
    id: "alcohol-gel",
    slug: "alcohol-gel",
    nombre: "Alcohol gel",
    categoria: "Higiene",
    principioActivo: "Alcohol",
    condicionVenta: "Venta directa",
    formato: "Gel higienizante",
    contenido: "250 ml",
    laboratorio: "Farmacia Andes",
    precio: 1490,
    imagen: "/products/alcohol-gel.svg",
    descripcion: "Gel para higiene de manos cuando no hay agua y jabon disponibles.",
    indicaciones: "Aplicar cantidad suficiente y frotar manos hasta secar.",
    advertencias: "Producto inflamable. Evitar contacto con ojos y mantener fuera del alcance de ninos.",
    conservacion: "Mantener lejos de fuentes de calor y con tapa cerrada.",
    relacionados: ["termometro-digital", "suero-fisiologico", "vitamina-c"]
  },
  {
    id: "termometro-digital",
    slug: "termometro-digital",
    nombre: "Termometro digital",
    categoria: "Cuidado familiar",
    principioActivo: "Dispositivo medico",
    condicionVenta: "Venta directa",
    formato: "Unidad",
    contenido: "1 unidad",
    laboratorio: "Dispositivo medico",
    precio: 3990,
    imagen: "/products/receta.svg",
    descripcion: "Dispositivo para control de temperatura corporal en el hogar.",
    indicaciones: "Util para seguimiento de fiebre y controles familiares.",
    advertencias: "Lee instrucciones del fabricante. Consulta si hay fiebre persistente o sintomas severos.",
    conservacion: "Limpiar despues de cada uso y guardar en lugar seco.",
    relacionados: ["paracetamol-500-mg", "alcohol-gel", "suero-fisiologico"]
  },
  {
    id: "suero-fisiologico",
    slug: "suero-fisiologico",
    nombre: "Suero fisiologico",
    categoria: "Cuidado familiar",
    principioActivo: "Cloruro de sodio 0,9%",
    condicionVenta: "Venta directa",
    formato: "Solucion topica o nasal",
    contenido: "100 ml",
    laboratorio: "Farmacia Andes",
    precio: 1890,
    imagen: "/products/suero.svg",
    descripcion: "Solucion salina para higiene nasal, limpieza o uso segun formato.",
    indicaciones: "Puede utilizarse para higiene nasal o limpieza externa segun presentacion.",
    advertencias: "No usar si el envase esta abierto, contaminado o vencido.",
    conservacion: "Mantener cerrado y respetar condiciones indicadas en el envase.",
    relacionados: ["loratadina-10-mg", "alcohol-gel", "termometro-digital"]
  },
  {
    id: "vitamina-c",
    slug: "vitamina-c",
    nombre: "Vitamina C",
    categoria: "Cuidado familiar",
    principioActivo: "Acido ascorbico",
    condicionVenta: "Venta directa",
    formato: "Comprimidos o efervescentes",
    contenido: "20 unidades",
    laboratorio: "Farmacia Andes",
    precio: 3490,
    imagen: "/products/receta.svg",
    descripcion: "Suplemento nutricional usado como apoyo al aporte diario de vitamina C.",
    indicaciones: "Uso como suplemento segun necesidad nutricional y recomendacion profesional.",
    advertencias: "Consulta si tienes enfermedad renal, calculos renales o tratamientos cronicos.",
    conservacion: "Guardar en lugar seco, protegido de humedad y calor.",
    relacionados: ["paracetamol-500-mg", "termometro-digital", "alcohol-gel"]
  },
  {
    id: "omeprazol-20-mg",
    slug: "omeprazol-20-mg",
    nombre: "Omeprazol 20 mg",
    categoria: "Medicamentos",
    principioActivo: "Omeprazol",
    condicionVenta: "Venta bajo indicacion profesional",
    formato: "Capsulas 20 mg",
    contenido: "30 capsulas",
    laboratorio: "Laboratorio Andes",
    precio: 2990,
    imagen: "/products/receta.svg",
    descripcion: "Medicamento que reduce la produccion de acido gastrico.",
    indicaciones: "Usado en molestias gastricas, reflujo o tratamientos indicados por profesional de salud.",
    advertencias: "No prolongar su uso sin control. Consulta si hay dolor intenso, sangrado o baja de peso.",
    conservacion: "Mantener en envase original, protegido de humedad y calor.",
    relacionados: ["ibuprofeno-400-mg", "paracetamol-500-mg", "suero-fisiologico"]
  },
  {
    id: "diclofenaco-gel",
    slug: "diclofenaco-gel",
    nombre: "Diclofenaco gel",
    categoria: "Medicamentos",
    principioActivo: "Diclofenaco",
    condicionVenta: "Venta directa",
    formato: "Gel topico",
    contenido: "30 g",
    laboratorio: "Farmacia Andes",
    precio: 4490,
    imagen: "/products/receta.svg",
    descripcion: "Antiinflamatorio topico para molestias musculares o articulares localizadas.",
    indicaciones: "Aplicar en zona afectada segun indicacion del envase o profesional.",
    advertencias: "No aplicar sobre heridas, mucosas o piel irritada. Evitar combinar sin orientacion.",
    conservacion: "Guardar cerrado, a temperatura ambiente y lejos del calor.",
    relacionados: ["ibuprofeno-400-mg", "paracetamol-500-mg", "alcohol-gel"]
  }
];

export function getProductoBySlug(slug: string) {
  return productos.find((producto) => producto.slug === slug);
}

export function getProductosRelacionados(slugs: string[]) {
  return slugs
    .map((slug) => getProductoBySlug(slug))
    .filter((producto): producto is AndesProduct => Boolean(producto));
}
