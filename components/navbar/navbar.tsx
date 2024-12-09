"use client"

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
}

export const NavbarWrapper = ({ children }: Props) => {

  const [isCookie, setHasCookie] = useState<boolean>(false)
  const [data, setData] = useState<User>()

  async function a (){
    const token: any = hasCookie("user-token")
    if (token === false) {
        await setHasCookie(false)
    }
    else {
        const a = await getDataByCookie()
        await setData(a.user as User)
        await setHasCookie(token === undefined ? false : true )
    }
  }

  useEffect(() => {
    a()
  }, [])
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
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden justify-center">
          <Button disabled size="sm" color='primary'>Annoucements<AnnoucnementIcon/></Button>
          -
        </NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >

          <Link
            href="https://github.com/oangsa/project-inventory-management"
            target={"_blank"}
          >
            <FaGithub className="fill-default-400" size={24}/>
          </Link>
          {isCookie === false ?

          <NavbarContent>
            <NavbarContent>
                {/* <LoginModal/> */}
            </NavbarContent>
          </NavbarContent>

          :

          <NavbarContent>
            <NavbarContent>
                {/* <Registeration name={data.name} surname={data.surname} month={data.oldMonth}/> */}
            </NavbarContent>
            <NavbarContent>
                <UserDropdown name={`${(data as User).name}`} image={`${(data as User).image}`} position={`${(data as User).role}`} companyName={(data as User).company.name} user={data as User} />
            </NavbarContent>
          </NavbarContent>

          }
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
