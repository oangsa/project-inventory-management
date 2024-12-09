"use client"

import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'
import {Breadcrumbs, BreadcrumbItem, Divider} from "@nextui-org/react";
import { usePathname } from "next/navigation"
import SettingBranches from '@/components/modals/branches/settings';


export default function AdminSettings({ searchParams }: any) {
    const path = usePathname();
    const { query, page }: any = use(searchParams) ?? ''

    const test = query ?? ''

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
             <Breadcrumbs size='lg' underline="active" onAction={(key) => window.location.replace(key as string)}>
                <BreadcrumbItem key="/" isCurrent={path === "/"}>
                    Home
                </BreadcrumbItem>
                <BreadcrumbItem key="/admin/dashboard" isCurrent={path === "/admin/dashboard"}>
                    Admin
                </BreadcrumbItem>
                <BreadcrumbItem key="/admin/users" isCurrent={path === "/admin/settings"}>
                    Settings
                </BreadcrumbItem>
            </Breadcrumbs>

            <h3 className="text-xl font-semibold">Branch Settings</h3>
            <div className="flex items-center gap-3">
               <SearchInput placeHolderText={'Search ...'} type={"branchSelect"} />
            </div>
            <Divider className="mt-4 mb-4"/>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                  <SettingBranches query={query}/>
                </Suspense>
            </div>
        </div>
    )
}
