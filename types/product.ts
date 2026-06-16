export type Product = {
  id: string;
  nombre: string;
  categoria: string;
  marca: string;
  descripcionCorta: string;
  precio: number;
  precioAnterior?: number;
  requiereReceta: boolean;
  destacado: boolean;
  imagenUrl: string;
  formato: string;
  bioequivalente?: boolean;
};
