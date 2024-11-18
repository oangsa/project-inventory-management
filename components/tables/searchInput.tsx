"use client"

import { Input } from '@nextui-org/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function SearchInput() {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const {  push } = useRouter()

    function handleSearch(searchedName: string) {
        const param = new URLSearchParams(searchParams);

        if (searchedName) {
            param.set("query", searchedName);
        }
        else {
            param.delete("query")
        }

        push(`${pathname}?${param.toString()}`)
    }
    
    return (
        <div className='flex gap-2'>
            <Input
            classNames={{
                input: "w-full",
                mainWrapper: "w-full",
            }}
            placeholder="Search Product"
            defaultValue={searchParams.get("query")?.toString()}
            onChange={(event) => handleSearch(event.target.value)}
        />
        </div>
        
    )
}
