"use client"

import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../layouts/layout-context";
import { SidebarItem } from "./sidebar-render-items";
import { SidebarMenu } from "./sidebar-render-menus";

// Icons
import { AiFillHome } from "react-icons/ai";
import { MdAccountBox } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import ChangeLog from "./changeLog";
import { User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";

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
                  isActive={pathname === '/test/products'}
                  title="Products"
                  icon={<AiFillProduct className="fill-default-400" size={24}/>}
                  href="/test/products"
                />
              </SidebarMenu>
            }

            {
              data?.role == "admin" ? 
                <SidebarMenu title="Admin">
                  <SidebarItem
                      isActive={pathname === '/test/admin/products'}
                      title="All Products"
                      icon={<AiFillProduct className="fill-default-400" size={24}/>}
                      href="/test/admin/products"
                    />
                  <SidebarItem
                    isActive={pathname === '/admin/list'}
                    title="Employees"
                    icon={<MdAccountBox className="fill-default-400" size={24}/>}
                    href="/admin/list"
                  />
              </SidebarMenu> :
              ""
            }

            {
              data?.role == "manager" ? 
              <SidebarMenu title="Manager">
                <SidebarItem
                  isActive={pathname === '/admin/list'}
                  title="Employees"
                  icon={<MdAccountBox className="fill-default-400" size={24}/>}
                  href="/admin/list"
                />
              </SidebarMenu> :
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