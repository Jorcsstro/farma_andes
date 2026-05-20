export type StockEstado = "disponible" | "consultar" | "agotado";

export type Product = {
  id: string;
  nombre: string;
  categoria: string;
  marca: string;
  descripcionCorta: string;
  precio: number;
  precioAnterior?: number;
  stockEstado: StockEstado;
  requiereReceta: boolean;
  destacado: boolean;
  imagenUrl: string;
  formato: string;
};
