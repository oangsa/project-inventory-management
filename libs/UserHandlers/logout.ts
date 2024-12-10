"use server";

import { cookies } from "next/headers";

export async function logoutHandler(): Promise<Record<string, string | number>> {
   const cookieStore = await cookies()

   cookieStore.delete("user-token")

   return {"status": 200, "message": "Successfully logged out."}
}
