"use server"

import { cookies } from 'next/headers'
import { verifyAuthAndGetData } from './auth';

export default async function getCookieValue() {
   // Just get the cookie.....
   const cookieStore = await cookies()

   const cookie: any = await cookieStore.get("user-token")?.value;

   if (cookie === undefined) return {"status": 401, "message": "Unauthorize!"};

   const verifyToken = cookie && (await verifyAuthAndGetData(cookie).catch((err) => {
      console.log(err)
   }))

   return verifyToken.user;
}
