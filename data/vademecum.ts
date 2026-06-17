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
  formasFarmaceut