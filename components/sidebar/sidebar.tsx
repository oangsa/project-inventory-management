"use client"

import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../layouts/layout-context";
import { SidebarItem } from "./sidebar-render-items";
import { SidebarMenu } from "./sidebar-render-menus";
import ChangeLog from "./changeLog";
import { User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";

// Icons
import { AiFillHome } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { RiAccountBoxFill } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [data, setData] = useState<User>()

  useEffect(() => {
    async function getData() {
      const res = await getDataByCookie();

      setData(res.user as User)
    }

    getData()

  }, [])


  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <div className="font-bold text-xl">
            Inventory Management
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarMenu title="General">
                <SidebarItem
                  title="Home"
                  icon={<AiFillHome className="fill-default-400" size={24}/>}
                  isActive={pathname === '/'}
                  href="/"
                />
            </SidebarMenu>

            { data?.role == "admin" ? "" :
              <SidebarMenu title="Products">
                <SidebarItem
                  isActive={pathname === '/products'}
                  title="Products"
                  icon={<AiFillProduct className="fill-default-400" size={24}/>}
                  href="/products"
                />
              </SidebarMenu>
            }

            {
               data?.role == "admin" ?
               <>

                  <SidebarMenu title="Admin Panel">
                     <SidebarItem
                           isActive={pathname === '/admin/products'}
                           title="All Products"
                           icon={<AiFillProduct className="fill-default-400" size={24}/>}
                           href="/admin/products"
                        />
                     <SidebarItem
                        isActive={pathname === '/admin/users'}
                        title="Employees"
                        icon={<RiAccountBoxFill className="fill-default-400" size={24}/>}
                        href="/admin/users"
                     />
                     <SidebarItem
                        isActive={pathname === '/admin/branches'}
                        title="Branches"
                        icon={<RiAccountBoxFill className="fill-default-400" size={24}/>}
                        href="/admin/branches"
                     />
                  </SidebarMenu>
                  <SidebarMenu title="Admin Setting">
                     <SidebarItem
                        isActive={pathname.includes('/admin/settings')}
                        title="Settings"
                        icon={<FaGear className="fill-default-400" size={24}/>}
                        href={`/admin/settings?company=${data?.companyId}`}
                     />
                  </SidebarMenu>
               </>

              :
              ""
            }

            {
              data?.role == "manager" ?
               <>
                  <SidebarMenu title="Manager Panel">
                     <SidebarItem
                        isActive={pathname === '/manager/users'}
                        title="Employees"
                        icon={<RiAccountBoxFill className="fill-default-400" size={24}/>}
                        href="/manager/users"
                     />
                  </SidebarMenu>
                  <SidebarMenu title="Manager Setting">
                     <SidebarItem
                        isActive={pathname.includes('/manager/settings')}
                        title="Settings"
                        icon={<AiFillProduct className="fill-default-400" size={24}/>}
                        href={`/manager/settings?branch=${data?.branchId}`}
                     />
                  </SidebarMenu>
               </>
               :
              ""
            }

            <SidebarMenu title="Changelog">
                <ChangeLog/>
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>

          </div>
        </div>
      </div>
    </aside>
  );
};
