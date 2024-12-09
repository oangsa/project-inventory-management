"use client"

import { Branch, providers } from "@/interfaces/controller-types"
import updateBranchHandler from "@/libs/CompanyHandler/updateBranch"
import getBranch from "@/libs/getBranch"
import { Select, SelectItem, Input, Divider, Button } from "@nextui-org/react"
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

interface providerSelect {
   key: providers,
   name: string
}

const providerLists: providerSelect[] = [
   {key: "line", name: "Line"},
   {key: "discord", name: "Discord"},
]

export default function SettingBranches({query}: {query: string}) {
   const [data, setData] = useState<Branch>({} as Branch)
   const [oldData, setOldData] = useState<Branch>({} as Branch)
   const [providerList, setProviderList] = useState<providerSelect[]>(providerLists);
   const [provider, setProvider] = useState<Set<string>>(new Set());
   const [hasData, setHasData] = useState<boolean>(false)
   const [isClicked, setIsClicked] = useState<boolean>(false)

   const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      setData((prev) => ({...prev, [name]: value}))
   }

   useEffect(() => {
      async function getData() {
         const res = await getBranch(query);
         setHasData(false)

         setProvider(new Set([]))

         if (res.name) {
            setProvider(new Set([res.provider]))
            setHasData(true)
         }

         setData(res)
         setOldData(res)

      }
      getData()
    }, [query])

    const btnSubmit = async () => toast.promise(
      submit(),
         {
            loading: 'Saving...',
            success: (data) => {
                  return <b>Saved!</b>
            },
            error: (e) => {
                  setIsClicked(false)
                  return (<b>{e.message}</b>)},
         },
         {
            loading: {
                  duration: 3000
            }
         }
      )

      const submit = async() => {
         const d = {
            name: data.name,
            lowestNoti: data.lowestNoti,
            provider: provider.values().next().value as unknown as providers,
            dependencies: data.dependencies
         } as Branch

         setIsClicked(true)

         if (!d.name || !d.lowestNoti || !d.provider || !d.dependencies) throw new Error("Please fill all the fields")

         if (d.provider == "line") throw new Error("Line is not supported yet.");

         if (!d.dependencies) throw new Error("Discord Webhook is required.");

         const updated = await updateBranchHandler(d, oldData);

         if (updated.status != 200) {
            throw new Error(updated.message as string)
         }

         setTimeout(() => window.location.reload(), 3010)

         return updated
       }

   return (
      <>
         <div className="flex flex-col gap-4">
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
               <Input isDisabled={!hasData || isClicked} value={data.name ? data.name : ""} onInput={inputHandler} name="name" label="Branch name" variant="flat" labelPlacement={"outside"} placeholder="Branch name"/>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
               <Input isDisabled={!hasData || isClicked} type="number" value={data.lowestNoti ? data.lowestNoti.toString() : "" } onInput={inputHandler} name="lowestNoti" label="Threashold" variant="flat" labelPlacement={"outside"} placeholder="Threashold"/>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
               <Select isDisabled={!hasData || isClicked}
                     label="Notification Provider"
                     name="provider"
                     // value={data.assignedRole ? data.assignedRole : ""}
                     selectedKeys={provider}
                     onSelectionChange={setProvider}
                     variant="flat"
                     labelPlacement={"outside"}
                     placeholder="Select Provider"
               >
                     {providerList.map((provider) => (
                        <SelectItem key={provider.key} value={provider.key}>
                           {provider.name}
                        </SelectItem>
                     ))}
               </Select>
            </div>
            {
               provider.values().next().value as unknown as providers == "line" ?
               <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                     <Input isDisabled={!hasData || isClicked} color="danger" disabled value={"Currently not support"} name="lowestnoti" label="Line" variant="flat" labelPlacement={"outside"} placeholder="Currently not support"/>
               </div>
               : provider.values().next().value as unknown as providers == "discord" ?
               <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                     <Input isDisabled={!hasData || isClicked} value={data.dependencies ? data.dependencies : "" } onInput={inputHandler} name="dependencies" label="Discord Webhook" variant="flat" labelPlacement={"outside"} placeholder="Discord Webhook"/>
               </div>
               : ""
            }
            <Divider className="mt-4"/>
            <Button onClick={btnSubmit} isLoading={isClicked} isDisabled={!hasData} className="xl:max-w-[50px]" color="primary" >Save</Button>
         </div>
      </>
   )
}
