"use server"

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function resetDay(req: NextApiRequest, res: NextApiResponse ) {
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
            let data = {
               embeds: [
                  {
                     title: "Inventory Management | Notification",
                     description: "These are the products that remain below the threshold",
                     color: 0xffff00,
                     fields: [] as {name: string, value: string, inline: boolean}[],
                     author: {
                        name: "Inventory Management | Notification Manager",
                     },
                  }
               ]
            }
            const fields: {name: string, value: string, inline: boolean}[] = []

            for (const product of products) {
               if ((product.fullStock / product.remain) * 100 < product.useInBranch.lowestNoti) {
                  fields.push({
                     name: product.name,
                     value: `Remain: ${product.remain}`,
                     inline: true
                  })
               }
            }

            try {

               data.embeds[0].fields = fields

               if (branch.dependencies == "discord") {
                  await fetch(branch.dependencies, {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(data)
                  })
               }
            }
            catch (error) {
               console.log(error)
            }
         }
      }
      return res.status(200).send("Success")
   }
   catch (err) {
      return res.status(404).send("Error")
   }
}
