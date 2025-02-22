"use client"

import { TableWrapper } from '@/components/tables/product-table/product-table'
import Link from 'next/link'
import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'

//Icons
import { AiFillHome } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { AddProductBtn } from '@/components/modals/products/addProduct'

export default function ProductList({ searchParams }: any) {

    const { query, page }: any = use(searchParams) ?? ''

    const test = query ?? ''
    const p = page ?? 1

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ul className="flex">
                <li className="flex gap-2">
                    <AiFillHome className="fill-default-400" size={24}/>
                    <Link href={"/"}>
                    <span>Test</span>
                    </Link>
                    <span> / </span>{" "}
                </li>

                <li className="flex gap-2">
                    <AiFillProduct className="fill-default-400" size={24}/>
                    <span>Products</span>
                </li>
            </ul>

            <h3 className="text-xl font-semibold">Products</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                <SearchInput placeHolderText={'Search Product'} type={'search'} query={"query"} />
            </div>
            <div className="pt-[23px] max-[375px]:pt-[1px] flex flex-row gap-3.5 flex-wrap">
                <AddProductBtn/>
            </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                    <TableWrapper query={test} page={p} />
                </Suspense>
            </div>
        </div>
    )
}
