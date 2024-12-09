"use client"

import getCompany from '@/libs/CompanyHandler/getCompany'
import getDataByCookie from '@/libs/getUserByCookie'
import { Input, Select, SelectItem, SharedSelection } from '@nextui-org/react'
import { User, Company, Branch } from '@/interfaces/controller-types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type types = "search" | "branchSelect"
interface SearchInputProps {
   placeHolderText: string,
   type: types,
   query: string,
}

interface branchSelect {
   key: string,
   name: string
}

export default function SearchInput(props: SearchInputProps) {
   const searchParams = useSearchParams()
   const pathname = usePathname()

   const { push } = useRouter()

   const [branchList, setBranchList] = useState<branchSelect[]>([]);

   const [branch, setBranch] = useState<Set<string>>(new Set<string>());

   useEffect(() => {
     async function getCompanyData() {
         const user = await getDataByCookie();

         if (user.status != 200) throw new Error(user.message as string)

         const company = await getCompany(user.user as User);

         const branches = (company.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))

         setBranchList(branches)

         const query = searchParams.get(props.query)?.toString();

         if (query) setBranch(new Set<string>([query]))

         else setBranch(new Set<string>())

     }
     getCompanyData()
   }, [searchParams])

   function handleSearch(searchedName: string) {
      const param = new URLSearchParams(searchParams);

      if (searchedName) {
         param.set(props.query, searchedName);
      }
      else {
         param.delete(props.query)
      }

      push(`${pathname}?${param.toString()}`)
   }

   return (
      <>
         {
            props.type === "search" ?
               <div className='flex gap-2'>
                  <Input
                     label = {props.placeHolderText}
                     labelPlacement='outside'
                     classNames={{
                        input: "w-full",
                        mainWrapper: "w-full",
                     }}
                     className="max-w-[500px] w-full"
                     placeholder= {props.placeHolderText}
                     defaultValue={searchParams.get(props.query)?.toString()}
                     onChange={(event) => handleSearch(event.target.value)}
                  />
               </div>
            :
               <Select
                  label = {props.placeHolderText}
                  labelPlacement='outside'
                  defaultSelectedKeys={branch as unknown as "all"}
                  selectedKeys={branch as unknown as "all"}
                  onSelectionChange={async (selected) => {
                     console.log(selected)
                     setBranch(new Set<string>(selected as unknown as string[]))
                     handleSearch(selected.currentKey as unknown as string)
                  }}
                  variant="flat"
                  placeholder="Select Branch"
                  className="max-w-[200px] w-full"
                  >
                  {branchList.map((branch) => (
                     <SelectItem key={branch.key} value={branch.key}>
                        {branch.name}
                     </SelectItem>
                  ))}
               </Select>
         }
      </>
   )
}
