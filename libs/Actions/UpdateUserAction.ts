"use server"

import { User } from "@/interfaces/controller-types";
import updateUserHandler from "../UserHandlers/updateUser";
import getDataByCookie from "../getUserByCookie";
import getToken from "../token";
import updateCookie from "../updateCookie";

export default async function updateUserAction(prevState: any, data: FormData): Promise<Record<string, string | number | User>> {
   const username = data.get("username") as string;
   const name = data.get("name") as string;
   const picture = data.get("img") as Blob | null;

   console.log(picture)

   const res = await getDataByCookie();

   const user = res.user as User;

   if (!picture) {
      return {status: 400, message: "Please upload a profile picture"};
   }

   let pictureUrl = ""

   const buffer = await picture.arrayBuffer();
   const base64String = Buffer.from(buffer).toString('base64');

   pictureUrl = `data:${picture.type};base64,${base64String}`;

   const userData = {
      ...user,
      name: name,
      username: username,
      image: picture.size > 0 ? pictureUrl : user.image
   } as User;

   const updated = await updateUserHandler(user.role, user.branchId, userData, user, user as User);

   const token = await getToken(updated.user as User)

   await updateCookie('user-token', token)

   return updated;
}
