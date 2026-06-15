import { getProductosRelacionados } from "@/data/productos";

export type VademecumEntry = {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  usosComunes: string[];
  advertencias: string[];
  consultaFarmaceutica: string[];
  productosRelacionados: string[];
};

export const vademecum: VademecumEntry[] = [
  {
    id: "paracetamol",
    slug: "paracetamol",
    nombre: "Paracetamol",
    categoria: "Analgesico y antipiretico",
    descripcion: "Principio activo usado para aliviar dolor leve a moderado y ayudar a reducir fiebre.",
    usosComunes: ["Dolor de cabeza", "Fiebre", "Dolor muscular leve", "Malestar general"],
    advertencias: [
      "No exceder la dosis recomendada.",
      "Evitar combinar con otros productos que tambien contengan paracetamol.",
      "Consultar en caso de enfermedad hepatica o consumo frecuente de alcohol."
    ],
    consultaFarmaceutica: [
      "Si la fiebre dura mas de 3 dias.",
      "Si hay dolor intenso o persistente.",
      "Si usas otros medicamentos para resfrio o gripe."
    ],
    productosRelacionados: ["paracetamol-500-mg", "termometro-digital", "vitamina-c"]
  },
  {
    id: "ibuprofeno",
    slug: "ibuprofeno",
    nombre: "Ibuprofeno",
    categoria: "Antiinflamatorio no esteroidal",
    descripcion: "Medicamento usado para dolor e inflamacion, siempre considerando factores de riesgo.",
    usosComunes: ["Dolor muscular", "Dolor dental", "Dolor menstrual", "Inflamacion leve"],
    advertencias: [
      "Puede irritar el estomago.",
      "Evitar sin orientacion en embarazo, enfermedad renal, ulcera o uso de anticoagulantes.",
      "No combinar con otros antiinflamatorios sin indicacion."
    ],
    consultaFarmaceutica: [
      "Si tienes gastritis o antecedentes de ulcera.",
      "Si tomas medicamentos para presion, anticoagulantes o corticoides.",
      "Si el dolor no mejora o aumenta."
    ],
    productosRelacionados: ["ibuprofeno-400-mg", "diclofenaco-gel", "paracetamol-500-mg"]
  },
  {
    id: "loratadina",
    slug: "loratadina",
    nombre: "Loratadina",
    categoria: "Antihistaminico",
    descripcion: "Principio activo usado para aliviar sintomas asociados a alergias.",
    usosComunes: ["Rinitis alergica", "Estornudos", "Picazon nasal u ocular", "Urticaria leve"],
    advertencias: [
      "Consultar si hay dificultad respiratoria o hinchazon intensa.",
      "Evitar duplicar con otros antihistaminicos sin orientacion.",
      "Revisar uso en embarazo, lactancia o enfermedades cronicas."
    ],
    consultaFarmaceutica: [
      "Si los sintomas duran varios dias.",
      "Si se acompanan de fiebre o secrecion espesa.",
      "Si necesitas combinar con descongestionantes."
    ],
    productosRelacionados: ["loratadina-10-mg", "suero-fisiologico", "protector-solar-spf-50"]
  },
  {
    id: "omeprazol",
    slug: "omeprazol",
    nombre: "Omeprazol",
    categoria: "Inhibidor de bomba de protones",
    descripcion: "Medicamento que disminuye la acidez gastrica y se usa en tratamientos especificos.",
    usosComunes: ["Reflujo", "Acidez", "Proteccion gastrica indicada", "Tratamientos digestivos"],
    advertencias: [
      "No usar por periodos prolongados sin control profesional.",
      "Consultar si hay dolor abdominal intenso, vomitos persistentes o sangre.",
      "Puede interactuar con algunos medicamentos."
    ],
    consultaFarmaceutica: [
      "Si lo usas todos los dias.",
      "Si necesitas combinarlo con antiinflamatorios.",
      "Si tienes sintomas nocturnos o recurrentes."
    ],
    productosRelacionados: ["omeprazol-20-mg", "ibuprofeno-400-mg", "paracetamol-500-mg"]
  },
  {
    id: "acetaminofen",
    slug: "acetaminofen",
    nombre: "Acetaminofen",
    categoria: "Referencia alternativa de paracetamol",
    descripcion: "Nombre alternativo usado en algunos paises para referirse al paracetamol.",
    usosComunes: ["Referencia educativa", "Dolor leve", "Fiebre"],
    advertencias: [
      "No se debe duplicar con paracetamol: corresponden al mismo principio activo.",
      "Revisar etiquetas de medicamentos combinados.",
      "Consultar si existe duda sobre equivalencias."
    ],
    consultaFarmaceutica: [
      "Si tienes dos medicamentos con nombres distintos.",
      "Si no sabes si un antigripal contiene paracetamol.",
      "Si necesitas calcular dosis segura."
    ],
    productosRelacionados: ["paracetamol-500-mg", "termometro-digital"]
  },
  {
    id: "diclofenaco",
    slug: "diclofenaco",
    nombre: "Diclofenaco",
    categoria: "Antiinflamatorio no esteroidal",
    descripcion: "Principio activo antiinflamatorio disponible en algunas presentaciones topicas u orales.",
    usosComunes: ["Dolor localizado", "Inflamacion muscular", "Molestias articulares"],
    advertencias: [
      "Evitar combinar con otros antiinflamatorios sin orientacion.",
      "No aplicar gel sobre heridas o piel irritada.",
      "Consultar en embarazo, enfermedad renal o antecedentes gastricos."
    ],
    consultaFarmaceutica: [
      "Si usas ibuprofeno, naproxeno u otro antiinflamatorio.",
      "Si el dolor se acompana de inflamacion intensa.",
      "Si necesitas escoger entre formato topico u oral."
    ],
    productosRelacionados: ["diclofenaco-gel", "ibuprofeno-400-mg", "paracetamol-500-mg"]
  }
];

export function getVademecumEntry(slug: string) {
  return vademecum.find((entry) => entry.slug === slug);
}

export function getProductosParaPrincipio(slug: string) {
  const entry = getVademecumEntry(slug);
  return entry ? getProductosRelacionados(entry.productosRelacionados) : [];
}
