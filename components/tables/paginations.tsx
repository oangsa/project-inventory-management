"use client"

import { Pagination } from '@nextui-org/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export default function TablePagination({length}: {length: number}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const { replace } = useRouter()

    function handleSearch(searchedName: number) {
        const param = new URLSearchParams(searchParams);

        if (searchedName) {
            param.set("page", searchedName.toString());
        }
        else {
            param.delete("page")
        }

        replace(`${pathname}?${param.toString()}`)
    }

    const rowsPerPage = 10;
  
    const pages = Math.ceil(length / rowsPerPage);

    const pg = parseInt(searchParams?.get("page") ?? "1") > 1 ? parseInt(searchParams?.get("page") ?? "1") : 1

    return (
        <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={pg}
            total={pages}
            onChange={handleSearch}
          />
    )
}
