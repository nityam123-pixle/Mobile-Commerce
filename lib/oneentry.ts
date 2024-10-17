import retriveRefreshToken from "@/actions/auth/retriveRefreshToken";
import storeRefreshToken from "@/actions/auth/storeRefreshToken";
import { defineOneEntry } from "oneentry";


export type ApiClientType = ReturnType<typeof defineOneEntry> | null

let apiClient: ApiClientType = null

async function setupApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
    const apiUrl = process.env.ONEENTRY_PROJECT_URL;

    if(!apiUrl) {
        throw new Error("ONEENTRY_PROJECT_URL env var is missing.");
    }

    if(!apiClient) {
        try {
            const refreshToken = await retriveRefreshToken()
            apiClient = defineOneEntry(apiUrl, {
                token:process.env.ONEENTRY_TOKEN,
                langCode:"en_US",
                auth: {
                    refreshToken:refreshToken || undefined,
                    customAuth:false,
                    saveFunction: async (newToken: string) => {
                        await storeRefreshToken(newToken)
                    }
                }
            })
        } 
        catch (error) {
            console.log("Error Fetching Error.",error)
        }
    }

    if(!apiClient) {
        throw new Error ("Failed to initialized API CLIENT.")
    }

    return apiClient
}


export async function fetchApiClient(): Promise<ReturnType<typeof defineOneEntry>> {
    if(!apiClient) {
        await setupApiClient();
    }
    if(!apiClient) {
        throw new Error("API CLIENT IS STILL NULL AFTER SETUP.")
    }

    return apiClient
}