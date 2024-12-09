import { PrismaClient } from "@prisma/client"
import { withOptimize } from "@prisma/extension-optimize";

declare global {
  var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || (new PrismaClient().$extends(
   withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY as string })
 ) as PrismaClient)
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client
