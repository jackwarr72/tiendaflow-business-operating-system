import { getActiveProducts, getCategories } from "@/app/actions";
import CatalogClient from "./catalog-client";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getCategories(),
  ]);

  return (
    <CatalogClient
      products={products}
      categories={categories}
      businessPhone={process.env.BUSINESS_WHATSAPP ?? ""}
    />
  );
}
