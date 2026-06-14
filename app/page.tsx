import { AndesHome } from "@/components/AndesHome";
import { getProducts } from "@/lib/products";

export default async function Home() {
  const products = await getProducts();

  return <AndesHome products={products} />;
}
