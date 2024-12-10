"use server"

import { cookies } from "next/headers";

export default async function updateCookie(name: string, value: string): Promise<Record<string, string | number>> {
   const cookieStore = await cookies()

   cookieStore.set(name, value, { maxAge: 30 * 24 * 3600, httpOnly: true })


   return {"status": 200, "message": "Cookie updated."}
}
