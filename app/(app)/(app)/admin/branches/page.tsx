"use client"

import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'


//Icons
import { AddBranchBtn } from '@/components/modals/branches/addBranch'
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { usePathname } from "next/navigation"
import { TableWrapperCompanyBranch } from '@/components/tables/company-branches-tables/company-branch-table'
import { MergeBranchBtn } from '@/components/modals/branches/mergeBranch';


export default function CompanyBranchList({ searchParams }: any) {
    const path = usePathname();
    const { query, page }: any = use(searchParams) ?? ''

    const test = query ?? ''
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
                <BreadcrumbItem key="/admin/branches" isCurrent={path === "/admin/branches"}>
                    Branches
                </BreadcrumbItem>
            </Breadcrumbs>

            <h3 className="text-xl font-semibold">Branches</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                <SearchInput placeHolderText={'Search Branch'} type={'search'} query={"query"} />
            </div>
            <div className="flex pt-[23px] max-[372px]:pt-[1px] flex-row gap-3.5 flex-wrap">
                <AddBranchBtn/>
                <MergeBranchBtn/>
            </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                    <TableWrapperCompanyBranch query={test} page={p} />
                </Suspense>
            </div>
        </div>
    )
}
