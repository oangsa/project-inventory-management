"use server"

import { User } from "@/interfaces/controller-types";
import regisHandler from "../UserHandlers/userRegis";

export default async function registerAction(prevState: any, data: FormData): Promise<Record<string, string | number | User>> {
   const username = data.get("username") as string;
   const password = data.get("password") as string;
   const name = data.get("name") as string;
   const inviteToken = data.get("token") as string;

   const picture = data.get("img") as Blob | null;

   if (!username || !password || !name || !inviteToken) {
      return {status: 400, message: "Please fill in all fields"};
   }

   if (!picture) {
      return {status: 400, message: "Please upload a profile picture"};
   }

   let pictureUrl = ""

   const buffer = await picture.arrayBuffer();
   const base64String = Buffer.from(buffer).toString('base64');

   pictureUrl = `data:${picture.type};base64,${base64String}`;

   const res = await regisHandler(username, password, name, inviteToken, pictureUrl) as Record<string, string | number | User>;

   return res;
}
