import { jwtVerify } from "jose"

interface UserJwtPayload {
    jti: string,
    iat: number
}

export const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY

    if (!secret || secret.length === 0) throw new Error("The environment variable JWT_SECRET_KEY is not set.")

    return secret;
}

// Verify the provided token
export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
        return verified.payload as UserJwtPayload
    } catch (error) {
        throw new Error("Your token is expried!")
    }
}
// Verify the provided token
export const verifyAuthAndGetData = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
        return verified.protectedHeader
    } catch (error) {
        throw new Error("Your token is expried!")
    }
}
