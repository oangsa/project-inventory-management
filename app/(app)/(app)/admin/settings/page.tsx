"use client"

import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'
import {Breadcrumbs, BreadcrumbItem, Divider} from "@nextui-org/react";
import { usePathname } from "next/navigation"
import SettingBranches from '@/components/modals/branches/settings';
import SettingCompany from '@/components/modals/company/settingCompany';


export default function AdminSettings({ searchParams }: any) {
    const path = usePathname();
    const { company, page }: any = use(searchParams) ?? ''

    const test = company ?? ''

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

            <h3 className="text-xl font-semibold">Company Settings</h3>
            <Divider className="mt-4 mb-4"/>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                  <SettingCompany query={company}/>
                </Suspense>
            </div>
        </div>
    )
}
