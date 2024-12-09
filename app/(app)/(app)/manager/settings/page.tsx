"use client"

import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'
import {Breadcrumbs, BreadcrumbItem, Divider} from "@nextui-org/react";
import { usePathname } from "next/navigation"
import SettingBranches from '@/components/modals/branches/settings';


export default function ManagerBranchSettings({ searchParams }: any) {
    const path = usePathname();
    const { branch, page }: any = use(searchParams) ?? ''

    const test = branch ?? ''

    return (
        <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
             <Breadcrumbs size='lg' underline="active" onAction={(key) => window.location.replace(key as string)}>
                <BreadcrumbItem key="/" isCurrent={path === "/"}>
                    Home
                </BreadcrumbItem>
                <BreadcrumbItem key="/admin/dashboard" isCurrent={path === "/manager/dashboard"}>
                    Manager
                </BreadcrumbItem>
                <BreadcrumbItem key="/admin/users" isCurrent={path === "/manager/settings"}>
                    Branch Settings
                </BreadcrumbItem>
            </Breadcrumbs>

            <h3 className="text-xl font-semibold">Branch Settings</h3>
            <Divider className="mt-4 mb-4"/>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                  <SettingBranches query={branch}/>
                </Suspense>
            </div>
        </div>
    )
}
