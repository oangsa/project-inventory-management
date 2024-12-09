"use client"

import { TableWrapperCompanyProduct } from '@/components/tables/company-product-table/company-product-table'
import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'


//Icons
import { AddProductBtn } from '@/components/modals/products/addProduct'
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { usePathname } from 'next/navigation'



export default function CompanyProductList({ searchParams }: any) {
    const path = usePathname();

    const { query, page, filter }: any = use(searchParams) ?? ''

    const test = query ?? ''
    const branch = filter ?? ''
    const p = page ?? 1

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <Breadcrumbs size='lg' underline="active" onAction={(key) => window.location.replace(key as string)}>
                <BreadcrumbItem key="/" isCurrent={path === "/"}>
                    Home
                </BreadcrumbItem>
                <BreadcrumbItem key="/admin/dashboard" isCurrent={path === "/admin/dashboard"}>
                    Admin
                </BreadcrumbItem>
                <BreadcrumbItem key="/admin/products" isCurrent={path === "/admin/products"}>
                    Products
                </BreadcrumbItem>
            </Breadcrumbs>

            <h3 className="text-xl font-semibold">Products</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                <SearchInput query={"query"} placeHolderText={'Search Product'} type={'search'}  />
                <SearchInput query={"filter"} placeHolderText={'Filter By Branch'} type={"branchSelect"} />
            </div>
            <div className="flex flex-row gap-3.5 flex-wrap">
                <AddProductBtn/>
            </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                    <TableWrapperCompanyProduct query={test} page={p} filter={branch} />
                </Suspense>
            </div>
        </div>
    )
}
