"use server"

import { cookies } from 'next/headers'

export default async function getCookies() {
   // Just get the cookie.....
   const cookieStore = await cookies()
   const cookie: any = await cookieStore.get("user-token")?.value;

   if (cookie === undefined) return {"status": 401, "message": "Unauthorize!"};


   return cookie;
}
