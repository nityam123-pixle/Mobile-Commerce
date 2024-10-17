"use server"

import { fetchApiClient } from "@/lib/oneentry"
import { IAttributes } from "oneentry/dist/base/utils"

export const getSignUpFormData = async(): Promise<IAttributes[]> => {
    try {
        const apiClient = await fetchApiClient();
        const response = await apiClient.Forms.getFormByMarker("sign-up")
        return response?.attributes as unknown as IAttributes[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log(error)
        throw new Error("Fetching form data failed.")
    }
}

export const handleSignUpSubmit = async (inputValues: {
    email: string;
    password: string;
    name: string;
}) => {
    try {
        const ApiClient = await fetchApiClient();
        const data = {
            "formIdentifier": "sign-up",
            "authData": [
                {
                    "marker": "email",
                    "value": inputValues.email
                },
                {
                    "marker": "password",
                    "value": inputValues.password
                }
            ],
            "formData": [
                {
                    "marker": "name",
                    "type": "string",
                    "value": inputValues.name
                }
            ],
            "notificationData": {
                "email": inputValues.email,
                "phonePush": ['+99999999999'],
                "phoneSMS": "+99999999999"
            }
        }
        const value = await ApiClient.AuthProvider.signUp("email",data)
        return value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.error(error);
        if ((error as { statusCode?: number })?.statusCode === 400) {
            return { message: error.message };
        }

        throw new Error("Account Creation Failed. Please Try Again Later.")
    }
}