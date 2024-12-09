"use client";

import { Divider, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalFooter, ModalHeader, NavbarItem, useDisclosure, ModalBody, Input, } from "@nextui-org/react";
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { logoutHandler } from "@/libs/UserHandlers/logout";
import toast from "react-hot-toast";
import { User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";
import updateUserHandler from "@/libs/UserHandlers/updateUser";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import getToken from "@/libs/token";
import { setCookie } from 'cookies-next';

interface props {
  image: string,
  name: string,
  companyName: string,
  position: string,
  user: User
}

export const UserDropdown = ({image, name, companyName, position, user}: props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [state, setState] = useState<string>("");
    const [data, setData] = useState<User>({} as User);

    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    var url = image
    const thirtydays = 30 * 24 * 60 * 60 * 1000

    if ( image === 'url' || image === '' ) url = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'

    const logout = async () => toast.promise(
        submit(),
        {
            loading: 'Logging out...',
            success: (data: any) => {
                return <b>{data?.message as ReactNode}</b>
            },
            error: (e) => {
                setIsClicked(false)
                return (<b>{e.message}</b>)},
        },
        {
            loading: {
                duration: 500
            }
        }
    )

    const submit = async() => {
        setIsClicked(true)
        const res = await logoutHandler();

        if (res.status != 200) throw new Error(res.message as string);

        setTimeout(() => window.location.reload(), 510)

        return res

    }


    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      console.log(name, value)

      setData((prev) => ({...prev, [name]: value}))
    }

    const getData = useCallback(async () => {
      return setData(user)
    }, [])

    // Fetch Data
    useEffect(() => {
      getData()
    }, [getData]);

    const update = async () => toast.promise(
      updateUser(),
      {
          loading: 'Saving...',
          success: (data) => {
              return <b>{data?.message as ReactNode}</b>
          },
          error: (e) => {
              setIsClicked(false)
              return (<b>{e.message}</b>)},
      },
      {
          loading: {
            duration: 1000
          },
      }
  )

    const updateUser = async() => {

      setIsClicked(true)

      const editor = await getDataByCookie();

      const updated = await updateUserHandler(user.role, user.branchId, data, user, editor.user as User);

      if (updated.status != 200) {
          throw new Error(updated.message as string)
      }

      const token = await getToken(updated.user as User)

      setCookie('user-token', token, { maxAge: thirtydays })

      setTimeout(() => window.location.reload(), 1010)

      return updated

    }

  return (
    <div>

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
                  if (actionKey === 'logout') {
                     setState("logout")
                     return onOpen()
                  };
                  if (actionKey === 'setting') {
                     setState("setting")
                     return onOpen()
                  };
                }}
            >
                <DropdownItem
                key="profile"
                className="flex flex-col justify-start w-full items-start"
                >
                  <h1 className="font-bold">Name</h1>
                  <p>{name}</p>
                </DropdownItem>
                <DropdownItem key="position">
                  <h1 className="font-bold">Position</h1>
                  <p className="capitalize">{position}</p>
                </DropdownItem>
                <DropdownItem key="company">
                  <h1 className="font-bold">Company</h1>
                  <p>{companyName}</p>
                </DropdownItem>
                <DropdownItem isDisabled key="divider1">
                  <Divider/>
                </DropdownItem>
                <DropdownItem key="setting">
                  <h1 className="font-bold">Settings</h1>
                </DropdownItem>
                <DropdownItem isDisabled key="divider2">
                    <Divider/>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger ">
                     Log out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            classNames ={{
            footer: "flex justify-center"
            }}
        >
            <ModalContent>
                {(onClose) => (
                  <>
                     {
                        state === "logout" ?

                           <>
                              <ModalHeader className="justify-center flex gap-1 text-2xl">
                                    Are you sure?
                              </ModalHeader>
                              <ModalFooter>
                                 <Button isDisabled={isClicked} variant="light" color="danger" onClick={onClose}>
                                       Cancel
                                 </Button>
                                 <Button isLoading={isClicked} color="primary" onClick={logout}>
                                       Yes
                                 </Button>
                              </ModalFooter>
                           </>
                        : state === "setting" ?
                           <>
                              <ModalHeader className="flex flex-col gap-1">
                                 Settings
                              </ModalHeader>
                              <ModalBody>
                                 <div className="flex flex-col gap-4">
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                       <Input value={data.name} onInput={inputHandler} name="name" label="Name" variant="flat" labelPlacement={"outside"} placeholder="Name"/>
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                       <Input value={data.username} onInput={inputHandler} name="username" label="Username" variant="flat" labelPlacement={"outside"} placeholder="Username"/>
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                       <Input color="warning" disabled type={isVisible ? "text" : "password"} value={data.password} onInput={inputHandler} name="password" label="password (Can't be changed.)" variant="flat" labelPlacement={"outside"} placeholder="password" endContent={ <button aria-label="toggle password visibility" className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)} > {isVisible ? ( <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> ) : ( <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" /> )} </button> }/>
                                    </div>
                                 </div>
                              </ModalBody>
                              <ModalFooter>
                                 <Button isDisabled={isClicked} color="danger" variant="flat" onClick={onClose}>
                                    Cancel
                                 </Button>
                                 <Button isLoading={isClicked} color="warning" onClick={update}>
                                    Update
                                 </Button>
                              </ModalFooter>
                           </> : ""
                     }

                  </>
                )}
            </ModalContent>
        </Modal>
    </div>
  );
};
