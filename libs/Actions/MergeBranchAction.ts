"use server"

import { Product, User } from '@/interfaces/controller-types'
import prisma from '@/libs/prismadb'
import { image } from '@nextui-org/react'

export default async function mergeBranchAction(prevState: any, formData: FormData): Promise<Record<string, string | number>> {
   const branch = formData.get("assignedBranch") as string
   const target = formData.get("mergeToBranch") as string
   const priceMode = formData.get("priceMode") as string

   if (!branch || !target) {
      return {"status": 400, "message": "Branches not selected"}
   }

   const branchProducts = await prisma.product.findMany({
      where: {
         branchId: branch
      }
   }) as Product[]

   const branchUsers = await prisma.user.findMany({
      where: {
         branchId: branch
      }
   }) as User[]

   if (!branchProducts && !branchUsers) {
      return {"status": 400, "message": "The branch is empty"}
   }

   const targetProducts = await prisma.product.findMany({
      where: {
         branchId: target
      }
   }) as Product[]

   for (let i = 0 ; i < branchProducts.length ; i++) {
      const product = branchProducts[i]
      const foundProduct = targetProducts.find((p) => p.name.toLowerCase() === product.name.toLowerCase())

      if (foundProduct) {
         await prisma.product.update({
            where: {
               id: foundProduct.id
            },
            data: {
               productCode: foundProduct.productCode,
               name: foundProduct.name,
               price: priceMode === "lower" ? Math.min(product.price, foundProduct.price) : Math.max(product.price, foundProduct.price),
               remain: product.remain + foundProduct.remain,
               fullStock: ((product.remain + foundProduct.remain) > foundProduct.remain) ? (product.remain + foundProduct.remain) : foundProduct.fullStock,
               totalSell: foundProduct.totalSell + product.totalSell,
               latestRefill: new Date(),
               latestEdit: new Date(),
               branchId: target,
               companyId: foundProduct.companyId
            }
         })
      }
      else {
         await prisma.product.create({
            data: {
               productCode: product.productCode,
               name: product.name,
               price: product.price,
               remain: product.remain,
               fullStock: product.fullStock,
               totalSell: product.totalSell,
               latestRefill: new Date(),
               latestEdit: new Date(),
               branchId: target,
               companyId: product.companyId
            }
         })
      }
   }

   console.log(branchUsers)

   for (let i = 0 ; i < branchUsers.length ; i++) {
      const user = branchUsers[i] as User

      const u = await prisma.user.findFirst({
         where: {
            username: user.username
         }
      })

      if (!u) {
         await prisma.user.create({
            data: {
               name: user.name,
               username: user.username,
               password: user.password,
               branchId: target,
               companyId: user.companyId,
               role: user.role,
               image: user.image
            }
         })
      }
      else {
         await prisma.user.create({
            data: {
               name: user.name,
               username: user.name,
               password: user.password,
               branchId: target,
               companyId: user.companyId,
               role: user.role,
               image: user.image
            }
         })
      }


   }

   await prisma.product.deleteMany({
      where: {
         branchId: branch
      }
   })

   await prisma.user.deleteMany({
      where: {
         branchId: branch
      }
   })

   await prisma.branch.delete({
      where: {
         id: branch
      }
   })

   return {"status": 200, "message": "Branches merged successfully"}
}
