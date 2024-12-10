"use server";
import { cookies } from "next/headers";

export default async function hasCookie(name: string) {
    // Just checking if cookie is exist or not.
    const cookieStore = await cookies()
    return cookieStore.get(name) == undefined ? false : true
}
