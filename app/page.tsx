import { Catalogo } from "@/components/Catalogo";
import { ClientEffects } from "@/components/ClientEffects";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCarousels } from "@/components/ProductCarousels";
import { OfertasYHorarios, Servicios } from "@/components/Sections";
import { SexualHealthPromo } from "@/components/SexualHealthPromo";
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
        <SexualHealthPromo products={products} />
        <Servicios />
        <OfertasYHorarios products={products} />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
