"use server"

import { fetchApiClient } from "@/lib/oneentry"

export const getProductDetails = async (productId: number) => {
    const apiClient = await fetchApiClient()

    if(!productId) {
        throw new Error("Product ID is required.")
    }

    try {
        const product = await apiClient.Products.getProductById(productId, "en_US")
        return product
    } catch (error) {
        console.error("Failed to Fetch Products: ", error)
        throw new Error("Failed to Fetch Products.")
    }
}