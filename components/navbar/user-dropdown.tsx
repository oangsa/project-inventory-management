import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, } from "@nextui-org/react";
import React from "react";
import { usePathname, useRouter } from 'next/navigation';
import { deleteCookie } from "cookies-next";

interface props {
  image: string,
  name: string,
  companyName: string
}

export const UserDropdown = ({image, name, companyName}: props) => {
  const router = useRouter()
  const pathname = usePathname()
  var url = image

  if ( image === 'url' || image === '' ) url = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'

  async function logoutClicked() {
    console.log("Logout btn clicked")
    // Swal.fire({
    //   title: 'ยืนยันที่จะลงชื่อออก?',
    //   icon: 'warning',
    //   showCancelButton: true ,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'ใช่'
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     deleteCookie("user-token")
    //     setTimeout(() => window.location.reload(), 1000)
    //     return
    //   }
    // })
 }

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src={url}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => {
          if (actionKey === 'logout') return logoutClicked()
        }}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <h1 className="font-bold">Name</h1>
          <p>{name}</p>
        </DropdownItem>
        <DropdownItem>
          <h1 className="font-bold">Company</h1>
          <p>{companyName}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" className="text-danger ">
           Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};