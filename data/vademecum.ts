export type VademecumRevision = {
  revisadoPor: string;
  fechaRevision: string;
  fuente: string;
};

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
  principioActivo?: string;
  categoriaTerapeutica?: string;
  formasFarmaceuticas?: string[];
  condicionesVenta?: string[];
  contraindicacionesGenerales?: string[];
  interaccionesGenerales?: string[];
  embarazoLactancia?: string;
  adultoMayor?: string;
  ninos?: string;
  cuandoConsultar?: string[];
  fuenteRevision?: VademecumRevision;
};

const revisionBase: VademecumRevision = {
  revisadoPor: "Quimico farmaceutico",
  fechaRevision: "2026-06-17",
  fuente: "Informacion sanitaria referencial y catalogo Farmacia Andes"
};

export const vademecum: VademecumEntry[] = [
  {
    id: "paracetamol",
    slug: "paracetamol",
    nombre: "Paracetamol",
    principioActivo: "Paracetamol",
    categoria: "Analgesico y antipiretico",
    categoriaTerapeutica: "Dolor y fiebre",
    descripcion: "Principio activo usado para aliviar dolor leve a moderado y ayudar a reducir fiebre. Debe usarse respetando dosis e intervalos indicados.",
    usosComunes: ["Dolor de cabeza", "Fiebre", "Dolor muscular leve", "Malestar general"],
    formasFarmaceuticas: ["Comprimidos", "Gotas", "Jarabe", "Supositorios"],
    condicionesVenta: ["Venta directa o segun presentacion"],
    advertencias: ["No exceder la dosis recomendada.", "Evitar combinar con otros productos que tambien contengan paracetamol.", "Consultar en caso de enfermedad hepatica o consumo frecuente de alcohol."],
    contraindicacionesGenerales: ["Alergia conocida al principio activo.", "Enfermedad hepatica grave, salvo indicacion profesional."],
    interaccionesGenerales: ["Puede estar presente en antigripales combinados.", "Consultar si se usan anticoagulantes u otros tratamientos cronicos."],
    embarazoLactancia: "Consultar con profesional de salud antes de usar durante embarazo o lactancia.",
    adultoMayor: "Usar con precaucion si existen enfermedades cronicas o polifarmacia.",
    ninos: "La dosis pediatrica depende del peso y de la presentacion. Confirmar con profesional.",
    consultaFarmaceutica: ["Si la fiebre dura mas de 3 dias.", "Si hay dolor intenso o persistente.", "Si usas otros medicamentos para resfrio o gripe."],
    cuandoConsultar: ["Fiebre persistente", "Dolor intenso", "Sospecha de sobredosis", "Uso en ninos, embarazo, adulto mayor o enfermedad cronica"],
    productosRelacionados: ["paracetamol", "acetaminofen"],
    fuenteRevision: revisionBase
  },
  {
    id: "ibuprofeno",
    slug: "ibuprofeno",
    nombre: "Ibuprofeno",
    principioActivo: "Ibuprofeno",
    categoria: "Antiinflamatorio no esteroidal",
    categoriaTerapeutica: "Dolor e inflamacion",
    descripcion: "Medicamento antiinflamatorio no esteroidal usado para dolor e inflamacion, siempre considerando factores de riesgo.",
    usosComunes: ["Dolor muscular", "Dolor dental", "Dolor menstrual", "Inflamacion leve"],
    formasFarmaceuticas: ["Comprimidos", "Capsulas", "Suspension oral"],
    condicionesVenta: ["Venta directa o receta segun presentacion"],
    advertencias: ["Puede irritar el estomago.", "Evitar sin orientacion en embarazo, enfermedad renal, ulcera o uso de anticoagulantes.", "No combinar con otros antiinflamatorios sin indicacion."],
    contraindicacionesGenerales: ["Alergia a antiinflamatorios.", "Antecedente de ulcera activa o sangrado digestivo sin control profesional."],
    interaccionesGenerales: ["Puede interactuar con anticoagulantes, antihipertensivos, corticoides y otros AINEs."],
    embarazoLactancia: "Evitar en embarazo salvo indicacion profesional, especialmente en etapas avanzadas.",
    adultoMayor: "Mayor riesgo de efectos gastrointestinales, renales y cardiovasculares.",
    ninos: "Usar solo presentaciones y dosis adecuadas para edad y peso.",
    consultaFarmaceutica: ["Si tienes gastritis o antecedentes de ulcera.", "Si tomas medicamentos para presion, anticoagulantes o corticoides.", "Si el dolor no mejora o aumenta."],
    cuandoConsultar: ["Dolor persistente", "Dolor con fiebre alta", "Antecedentes gastricos, renales o cardiovasculares"],
    productosRelacionados: ["ibuprofeno"],
    fuenteRevision: revisionBase
  },
  {
    id: "loratadina",
    slug: "loratadina",
    nombre: "Loratadina",
    principioActivo: "Loratadina",
    categoria: "Antihistaminico",
    categoriaTerapeutica: "Alergias",
    descripcion: "Principio activo usado para aliviar sintomas asociados a alergias como rinitis alergica o urticaria leve.",
    usosComunes: ["Rinitis alergica", "Estornudos", "Picazon nasal u ocular", "Urticaria leve"],
    formasFarmaceuticas: ["Comprimidos", "Jarabe"],
    condicionesVenta: ["Venta directa o segun presentacion"],
    advertencias: ["Consultar si hay dificultad respiratoria o hinchazon intensa.", "Evitar duplicar con otros antihistaminicos sin orientacion.", "Revisar uso en embarazo, lactancia o enfermedades cronicas."],
    contraindicacionesGenerales: ["Alergia conocida al principio activo."],
    interaccionesGenerales: ["Consultar si se usan sedantes, alcohol u otros antialergicos."],
    embarazoLactancia: "Consultar antes de usar en embarazo o lactancia.",
    adultoMayor: "Revisar uso si existe polifarmacia o enfermedades cronicas.",
    ninos: "Usar dosis y presentacion segun edad y peso.",
    consultaFarmaceutica: ["Si los sintomas duran varios dias.", "Si se acompanan de fiebre o secrecion espesa.", "Si necesitas combinar con descongestionantes."],
    cuandoConsultar: ["Dificultad respiratoria", "Hinchazon de labios, lengua o rostro", "Sintomas persistentes"],
    productosRelacionados: ["loratadina"],
    fuenteRevision: revisionBase
  },
  {
    id: "omeprazol",
    slug: "omeprazol",
    nombre: "Omeprazol",
    principioActivo: "Omeprazol",
    categoria: "Inhibidor de bomba de protones",
    categoriaTerapeutica: "Salud digestiva",
    descripcion: "Medicamento que disminuye la acidez gastrica y se usa en tratamientos especificos indicados por profesionales de salud.",
    usosComunes: ["Reflujo", "Acidez", "Proteccion gastrica indicada", "Tratamientos digestivos"],
    formasFarmaceuticas: ["Capsulas", "Comprimidos"],
    condicionesVenta: ["Venta directa o receta segun presentacion"],
    advertencias: ["No usar por periodos prolongados sin control profesional.", "Consultar si hay dolor abdominal intenso, vomitos persistentes o sangre.", "Puede interactuar con algunos medicamentos."],
    contraindicacionesGenerales: ["Alergia conocida al principio activo."],
    interaccionesGenerales: ["Puede modificar la absorcion o efecto de algunos tratamientos. Consultar en polifarmacia."],
    embarazoLactancia: "Consultar antes de usar en embarazo o lactancia.",
    adultoMayor: "Revisar uso prolongado y tratamientos concomitantes.",
    ninos: "Uso pediatrico solo con indicacion profesional.",
    consultaFarmaceutica: ["Si lo usas todos los dias.", "Si necesitas combinarlo con antiinflamatorios.", "Si tienes sintomas nocturnos o recurrentes."],
    cuandoConsultar: ["Acidez recurrente", "Dolor abdominal intenso", "Vomitos persistentes", "Sangrado digestivo"],
    productosRelacionados: ["omeprazol"],
    fuenteRevision: revisionBase
  },
  {
    id: "diclofenaco",
    slug: "diclofenaco",
    nombre: "Diclofenaco",
    principioActivo: "Diclofenaco",
    categoria: "Antiinflamatorio no esteroidal",
    categoriaTerapeutica: "Dolor e inflamacion",
    descripcion: "Principio activo antiinflamatorio disponible en algunas presentaciones topicas u orales.",
    usosComunes: ["Dolor localizado", "Inflamacion muscular", "Molestias articulares"],
    formasFarmaceuticas: ["Gel", "Comprimidos", "Ampollas segun disponibilidad"],
    condicionesVenta: ["Venta directa o receta segun presentacion"],
    advertencias: ["Evitar combinar con otros antiinflamatorios sin orientacion.", "No aplicar gel sobre heridas o piel irritada.", "Consultar en embarazo, enfermedad renal o antecedentes gastricos."],
    contraindicacionesGenerales: ["Alergia a antiinflamatorios.", "Antecedentes de reacciones severas a AINEs."],
    interaccionesGenerales: ["Puede interactuar con anticoagulantes, corticoides, antihipertensivos y otros antiinflamatorios."],
    embarazoLactancia: "Consultar antes de usar. Evitar automedicacion durante embarazo.",
    adultoMayor: "Mayor riesgo de efectos adversos gastrointestinales, renales o cardiovasculares.",
    ninos: "Uso pediatrico solo si corresponde a la presentacion y con orientacion profesional.",
    consultaFarmaceutica: ["Si usas ibuprofeno, naproxeno u otro antiinflamatorio.", "Si el dolor se acompana de inflamacion intensa.", "Si necesitas escoger entre formato topico u oral."],
    cuandoConsultar: ["Dolor persistente", "Inflamacion intensa", "Antecedentes gastricos, renales o cardiovasculares"],
    productosRelacionados: ["diclofenaco"],
    fuenteRevision: revisionBase
  },
  {
    id: "amoxicilina",
    slug: "amoxicilina",
    nombre: "Amoxicilina",
    principioActivo: "Amoxicilina",
    categoria: "Antibiotico betalactamico",
    categoriaTerapeutica: "Antibioticos",
    descripcion: "Antibiotico que debe utilizarse solo con indicacion profesional y respetando el tratamiento prescrito.",
    usosComunes: ["Infecciones bacterianas indicadas por profesional", "Tratamientos con receta"],
    formasFarmaceuticas: ["Capsulas", "Comprimidos", "Suspension oral"],
    condicionesVenta: ["Requiere receta"],
    advertencias: ["No usar sin receta.", "No suspender el tratamiento antes de lo indicado.", "Informar alergias a penicilinas o cefalosporinas."],
    contraindicacionesGenerales: ["Alergia a penicilinas o antibioticos betalactamicos."],
    interaccionesGenerales: ["Consultar si se usan anticoagulantes, anticonceptivos u otros tratamientos cronicos."],
    embarazoLactancia: "Usar solo bajo indicacion profesional.",
    adultoMayor: "Revisar funcion renal y tratamientos concomitantes con profesional de salud.",
    ninos: "Dosis pediatrica depende de peso, diagnostico y presentacion. Requiere indicacion profesional.",
    consultaFarmaceutica: ["Si no tienes receta.", "Si tienes antecedente de alergia a antibioticos.", "Si aparecen ronchas, dificultad respiratoria o diarrea intensa."],
    cuandoConsultar: ["Sospecha de infeccion", "Alergia", "Efectos adversos", "Dudas sobre duracion del tratamiento"],
    productosRelacionados: ["amoxicilina"],
    fuenteRevision: revisionBase
  }
];
