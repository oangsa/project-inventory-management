"use server"

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'

export default async function notify(req: NextApiRequest, res: NextApiResponse ) {
   const content = {
      context: "test",
   }

   await fetch("https://discord.com/api/webhooks/1316133255224885340/WS2dU9x8hMelzOiMO-AFw2RqlO8Lq89t-RCREArYispcV0yEfe-DY_8tlS840baZ1W2o",
      {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(content)
      }
   )

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
