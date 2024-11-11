"use server"
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "./auth";
import { User } from "@/interfaces/controller-types";

export default async function getToken (res: User) {
    const token = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256', res})
        .setJti(nanoid())
        .setExpirationTime('30 days')
        .sign(new TextEncoder().encode(getJwtSecretKey()))
    
        return token
}