"use client";

import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";

interface Props {
   children: React.ReactNode;

   collapsed: boolean;

   setCollapsed: () => void;

 }
export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
    setLocked(!sidebarOpen);
  };

  return (
    <section className="flex">
      <SidebarWrapper
        collapsed={sidebarOpen}
        setCollapsed={handleToggleSidebar}
      />
      <NavbarWrapper
        collapsed={sidebarOpen as unknown as boolean}
        setCollapsed={handleToggleSidebar}
      >
        {children}
      </NavbarWrapper>
    </section>
  );
};
