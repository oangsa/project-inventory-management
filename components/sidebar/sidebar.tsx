"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-render-items";
import { SidebarMenu } from "./sidebar-render-menus";
import ChangeLog from "./changeLog";
import { User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";

import { AiFillHome } from "react-icons/ai";
import { AiFillProduct } from "react-icons/ai";
import { RiAccountBoxFill } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: () => void;
}

export const SidebarWrapper = ({ collapsed, setCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const [data, setData] = useState<User>();

  useEffect(() => {
    async function getData() {
      const res = await getDataByCookie();
      setData(res.user as User);
    }

    getData();
  }, []);

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
          <div className="font-bold text-2xl">
            Inventory Management
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarMenu title="General">
              <SidebarItem
                title="Home"
                icon={<AiFillHome className="fill-default-400" size={24} />}
                isActive={pathname === "/"}
                href="/"
                setCollapsed={setCollapsed}
              />
            </SidebarMenu>

            { data?.role == "admin" ? "" :
              <SidebarMenu title="Products">
                <SidebarItem
                  isActive={pathname === '/products'}
                  title="Products"
                  icon={<AiFillProduct className="fill-default-400" size={24}/>}
                  href="/products"
                  setCollapsed={setCollapsed}
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
                           setCollapsed={setCollapsed}
                        />
                     <SidebarItem
                        isActive={pathname === '/admin/users'}
                        title="Employees"
                        icon={<RiAccountBoxFill className="fill-default-400" size={24}/>}
                        href="/admin/users"
                        setCollapsed={setCollapsed}
                     />
                     <SidebarItem
                        isActive={pathname === '/admin/branches'}
                        title="Branches"
                        icon={<FaStore className="fill-default-400" size={24}/>}
                        href="/admin/branches"
                        setCollapsed={setCollapsed}
                     />
                  </SidebarMenu>
                  <SidebarMenu title="Admin Setting">
                     <SidebarItem
                        isActive={pathname.includes('/admin/settings')}
                        title="Settings"
                        icon={<FaGear className="fill-default-400" size={24}/>}
                        href={`/admin/settings?company=${data?.companyId}`}
                        setCollapsed={setCollapsed}
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
                        setCollapsed={setCollapsed}
                     />
                  </SidebarMenu>
                  <SidebarMenu title="Manager Setting">
                     <SidebarItem
                        isActive={pathname.includes('/manager/settings')}
                        title="Settings"
                        icon={<AiFillProduct className="fill-default-400" size={24}/>}
                        href={`/manager/settings?branch=${data?.branchId}`}
                        setCollapsed={setCollapsed}
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
          <div className={Sidebar.Footer()}></div>
        </div>
      </div>
    </aside>
  );
};
