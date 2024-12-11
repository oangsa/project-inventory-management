"use client";

import { Button, Link, Navbar, NavbarContent } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { BurguerButton } from "./burguer-btn";
import { UserDropdown } from "./user-dropdown";
import hasCookie from "@/libs/hasCookie";
import { User } from "@/interfaces/controller-types";
import { AnnoucnementIcon } from "../icons/navbar/AnnoucementIcon";
import { FaGithub } from "react-icons/fa6";
import getDataByCookie from "@/libs/getUserByCookie";

interface Props {
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: () => void;
}

export const NavbarWrapper = ({ children, collapsed, setCollapsed }: Props) => {
  const [isCookie, setHasCookie] = useState<boolean>(false);
  const [data, setData] = useState<User>();

  // Fetch cookie and user data
  const fetchUserData = async () => {
    const token: any = hasCookie("user-token");
    if (!token) {
      setHasCookie(false);
    } else {
      const response = await getDataByCookie();
      setData(response.user as User);
      setHasCookie(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton collapsed={collapsed} setCollapsed={setCollapsed} />
        </NavbarContent>

        <NavbarContent className="w-full max-md:hidden justify-center">
          <Button disabled size="sm" color="primary">
            Announcements <AnnoucnementIcon/>
          </Button>
          Release beta 1.4
        </NavbarContent>

        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <Link
            href="https://github.com/oangsa/project-inventory-management"
            target={"_blank"}
          >
            <FaGithub className="fill-default-400" size={24} />
          </Link>

          {isCookie === false ? (
            <NavbarContent>
            </NavbarContent>
          ) : (
            <NavbarContent>
              <NavbarContent>
                <UserDropdown
                  name={`${data?.name}`}
                  image={`${data?.image}`}
                  position={`${data?.role}`}
                  companyName={data?.company.name as string}
                  user={data as User}
                />
              </NavbarContent>
            </NavbarContent>
          )}
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
