"use server"

import bcrypt from 'bcrypt';

export async function encryptPassword(password: string): Promise<string> {
   const hashedPassword = bcrypt.hashSync(password, parseInt((process.env.SALT as string)));

   return hashedPassword;
}

export async function decryptPassword(password: string, encrypedPassword: string): Promise<boolean> {
   const result = await bcrypt.compare(password, encrypedPassword)

   return result;
}
