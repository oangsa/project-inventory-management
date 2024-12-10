import prisma from '@/libs/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: any, res: any ): Promise<NextResponse<any>> {

   try {
      const companies = await prisma.company.findMany({
         include: {
            Branch: true
         }
      })

      for (const company of companies) {
         for (const branch of company.Branch) {
            const products = await prisma.product.findMany({
               where: {
                  branchId: branch.id
               },
               include: {
                  useInBranch: true
               },
            })
            const data = {
               embeds: [
                  {
                     title: company.name,
                     description: "These are the products that remain below the threshold",
                     color: 0xffff00,
                     fields: [] as {name: string, value?: string, inline?: boolean}[],
                     author: {
                        name: "Inventory Management | Notification Manager",
                     },
                  }
               ]
            }
            const fields: {name: string, value?: string, inline?: boolean}[] = []

            for (const product of products) {

               if ((product.remain / product.fullStock) * 100 < product.useInBranch.lowestNoti) {
                  fields.push({
                     name: product.name,
                     value: `Remain: ${product.remain}`,
                     inline: true
                  })
               }

            }
            if (fields.length <= 0) {
               fields.push({
                  name: "No products below threshold",
                  inline: true
               })

               data.embeds[0].color = 0x00ff00
               data.embeds[0].fields = fields

               if (branch.provider == "discord") {
                  try {
                     const a = await fetch(branch.dependencies, {
                        method: 'POST',
                        headers: {
                           'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                     })

                     console.log(a.status)
                  }
                  catch (error) {
                     console.log("Error")
                  }
               }
            }
            try {
               data.embeds[0].fields = fields

               if (branch.provider == "discord") {
                  const a = await fetch(branch.dependencies, {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(data)
                  })

                  console.log(a.status)
               }
            }
            catch (error) {
               console.log("Error")
            }
         }
      }
      return NextResponse.json({ message: "OK" }, { status: 200 })
   }
   catch (err) {
      console.log(err)
      return NextResponse.json({ error: "Error" }, { status: 404 })
   }
}
