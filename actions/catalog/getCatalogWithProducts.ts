"use server"

import { fetchApiClient } from "@/lib/oneentry";
import { IPagesEntity } from "oneentry/dist/pages/pagesInterfaces";
import { getCatalogs } from "./getCatalog";

export const getCatalogWithProducts = async () => {
  const apiClient = await fetchApiClient();
  const catalogs: IPagesEntity[] = await getCatalogs();
  const catalogsWithProducts = [];
  if (catalogs) {
    for (const catalog of catalogs) {
      const products = await apiClient.Products.getProductsByPageId(
        catalog.id,
        undefined,
        "en_US",
        { limit: 4 }
    );
    catalogsWithProducts.push({ ...catalog, catalogProducts: products})
    }
    return catalogsWithProducts;
  }
};
