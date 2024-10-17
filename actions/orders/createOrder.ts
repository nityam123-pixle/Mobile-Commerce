"use server";

import { fetchApiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";
import { IOrderData } from "oneentry/dist/orders/ordersInterfaces";

export default async function createOrder(orderData: IOrderData): Promise<string> {
  const apiClient = fetchApiClient();

  // Check if API client was fetched successfully
  if (!apiClient) {
    throw new Error("Failed to fetch API client");
  }

  // Fetch the access token from cookies
  const accessToken = cookies().get("access_token")?.value;
  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    // Create the order
    const client = await apiClient; // Ensure client is awaited
    const createdOrder = await client.Orders.setAccessToken(accessToken).createOrder("orders", orderData);
    console.log("Created Order:", createdOrder); // Log order response for debugging

    if (!createdOrder?.id) {
      throw new Error("Order creation was unsuccessful.");
    }

    // Create the payment session
    const paymentSession = await client.Payments.setAccessToken(accessToken).createSession(createdOrder.id, "session");
    console.log("Payment Session:", paymentSession); // Log payment session for debugging

    if (!paymentSession?.paymentUrl) {
      throw new Error("Payment session creation failed.");
    }

    return paymentSession.paymentUrl;

  } catch (error) {
    // Log the error for debugging
    console.error("Error during order and payment processing.", error);
    
    // Throw a descriptive error message
    throw new Error(
      `Order or payment session creation failed. ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`
    );
  }
}