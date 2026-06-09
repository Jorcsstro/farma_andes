import { Catalogo } from "@/components/Catalogo";
import { ClientEffects } from "@/components/ClientEffects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCarousels } from "@/components/ProductCarousels";
import { Contacto, OfertasYHorarios, Servicios } from "@/components/Sections";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <ClientEffects />
      
      <Header />
      <main>
        <Catalogo products={products} />
        <ProductCarousels products={products} />
        <Servicios />
        <OfertasYHorarios />
        
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
