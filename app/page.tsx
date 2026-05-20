import { Catalogo } from "@/components/Catalogo";
import { ClientEffects } from "@/components/ClientEffects";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Contacto, Experiencia, OfertasYHorarios, Servicios } from "@/components/Sections";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <ClientEffects />
      <Header />
      <main>
        <Hero />
        <Catalogo products={products} />
        <Servicios />
        <OfertasYHorarios />
        <Experiencia />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
