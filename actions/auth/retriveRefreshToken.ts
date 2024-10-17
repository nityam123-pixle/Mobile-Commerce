"use server"

import { cookies } from "next/headers"

export default async function retriveRefreshToken() {
    return cookies().get("refresh_token")?.value
}