"use server";

import { fetchApiClient } from "@/lib/oneentry";
import { cookies } from "next/headers";

interface IErrorResponse {
  statusCode: number;
  message: string;
}

export default async function getUserSession() {
  const apiClient = await fetchApiClient();
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const currentUser = await apiClient.Users.setAccessToken(
      accessToken
    ).getUser();
    if (!currentUser || !currentUser.id) {
      throw new Error("Invalid User data or missing user ID.");
    }

    return currentUser;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error as unknown as IErrorResponse).statusCode === 401
    ) {
      console.error("Failed to Retrive user session: ", error);
    }
  }
}
