"use server"

import { fetchApiClient } from "@/lib/oneentry"

export const searchProductAction = async (query:string) => {
    try {
        const apiClient = await fetchApiClient();
        const products = await apiClient.Products.searchProduct(query, "en_US")
        return products || [];
    } catch (error) {
        console.error("Error searching products.",error)
        throw new Error(`Products search Failed: ${error instanceof Error? error.message : "Unkown error"}`)
    }
}