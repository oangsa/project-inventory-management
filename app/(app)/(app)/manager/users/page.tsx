"use client"

import SearchInput from '@/components/tables/searchInput'
import { Suspense, use } from 'react'


//Icons
import { AddUserBtn } from '@/components/modals/users/addUser'
import { InviteCodeCreateBtn } from '@/components/modals/users/inviteTokenCreate'
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { usePathname } from "next/navigation"
import { TableWrapperUsers } from '@/components/tables/users-table/users-table'


export default function UsersList({ searchParams }: any) {
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
                <BreadcrumbItem key="/manager" isCurrent={path === "/"}>
                    Manager
                </BreadcrumbItem>
                <BreadcrumbItem key="/manager/users" isCurrent={path === "/manager/users"}>
                    Users
                </BreadcrumbItem>
            </Breadcrumbs>

            <h3 className="text-xl font-semibold">Users</h3>
            <div className="flex justify-between flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                <SearchInput query={"query"} placeHolderText={'Search User'} type={'search'} />
            </div>
            <div className="flex flex-row gap-3.5 flex-wrap">
                <AddUserBtn/>
            </div>
            </div>
            <div className="max-w-[95rem] mx-auto w-full">
                <Suspense fallback={<div>Loading</div>}>
                    <TableWrapperUsers query={test} page={p} />
                </Suspense>
            </div>
        </div>
    )
}
