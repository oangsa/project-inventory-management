"use client";

import { Divider, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalFooter, ModalHeader, NavbarItem, useDisclosure, ModalBody, Input, } from "@nextui-org/react";
import { ChangeEvent, FormEvent, ReactNode, useActionState, useCallback, useEffect, useMemo, useState } from "react";
import { logoutHandler } from "@/libs/UserHandlers/logout";
import toast from "react-hot-toast";
import { User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";
import updateUserHandler from "@/libs/UserHandlers/updateUser";
import getToken from "@/libs/token";
import { setCookie } from 'cookies-next';
import updateCookie from "@/libs/updateCookie";
import { ThemeSwitcher } from "./themeSwitcher";
import updateUserAction from "@/libs/Actions/UpdateUserAction";

interface props {
  image: string,
  name: string,
  companyName: string,
  position: string,
  user: User
}

interface ErrorTest {
   message: string
   isError: boolean
}

export const UserDropdown = ({image, name, companyName, position, user}: props) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const [response, formAction, isPending] = useActionState(updateUserAction, null);

   const [state, setState] = useState<string>("");
   const [userData, setUserData] = useState<User>({} as User);
   const [fileError, setFileError] = useState<ErrorTest>({message: "", isError: false})

   const [toastId, setToastId] = useState<string>("GAY");

   const [isClicked, setIsClicked] = useState<boolean>(false);

   let url = image

   const thirtydays = 30 * 24 * 60 * 60 * 1000
   const tenMegaBytes = 4000000

   if ( image === 'url' || image === '' ) url = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'

   const validateFile = (file: File) => {

      if (file.size > tenMegaBytes) {
         setFileError({message: "File size is too large", isError: true})
         return false
      }
      else if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
         setFileError({message: "File type is not supported", isError: true})
         return false
      }
      else {
         setFileError({message: "", isError: false})
         return true
      }

   }

   const logout = async () => toast.promise(
      logoutSubmit(),
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

   const logoutSubmit = async() => {
      setIsClicked(true)
      const res = await logoutHandler();

      if (res.status != 200) throw new Error(res.message as string);

      setTimeout(() => window.location.reload(), 510)

      return res

   }

   const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      setUserData((prev) => ({...prev, [name]: value}))
   }

   const getData = useCallback(async () => {
      return setUserData(user)
   }, [user])

   // Fetch Data
   useEffect(() => {
      getData()
   }, [getData]);

   const submit = async(queryData: FormData): Promise<void> => {
      await formAction(queryData)

      toast.loading('Saving...', {
         id: toastId
      })

   }

   useEffect(() => {
      if (!response) {
         return;
      }

      if (response?.status != 200) {
         toast.error(response?.message as string, {
            id: toastId
         });
      }

      else if (response?.status == 200) {
         toast.success(response?.message as string, {
            id: toastId
         });

         setTimeout(() => {
            window.location.reload()
         }, 1010);
      }
   }, [isPending, response, toastId]);

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
                <DropdownItem key='switch'>
                  <ThemeSwitcher />
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
                                 <Button isDisabled={isClicked} variant="light" color="danger" onPress={onClose}>
                                    Cancel
                                 </Button>
                                 <Button isLoading={isClicked} color="primary" onPress={logout}>
                                    Yes
                                 </Button>
                              </ModalFooter>
                           </>
                        : state === "setting" ?
                           <>
                              <ModalHeader className="flex flex-col gap-1">
                                 Settings
                              </ModalHeader>
                              <form action={submit}>
                                 <ModalBody>
                                    <div className="flex flex-col gap-4">
                                       <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                          <Input value={userData.name} onInput={inputHandler} name="name" label="Name" variant="flat" labelPlacement={"outside"} placeholder="Name"/>
                                       </div>
                                       <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                          <Input value={userData.username} onInput={inputHandler} name="username" label="Username" variant="flat" labelPlacement={"outside"} placeholder="Username"/>
                                       </div>
                                       <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                          <Input onChange={() => {
                                             const fileInput = document.getElementById("img") as HTMLInputElement;
                                             if (fileInput && fileInput.files && fileInput.files[0]) {
                                                validateFile(fileInput.files[0]);
                                             }
                                          }} isInvalid={fileError.isError} errorMessage={fileError.message} id="img" name="img" label="Profile" labelPlacement="outside" type="file" onInput={inputHandler}/>
                                       </div>
                                    </div>
                                 </ModalBody>
                                 <ModalFooter className="justify-end">
                                    <Button isDisabled={isClicked} color="danger" variant="flat" onPress={onClose}>
                                       Cancel
                                    </Button>
                                    <Button isLoading={isClicked} color="warning" type="submit">
                                       Update
                                    </Button>
                                 </ModalFooter>
                              </form>
                           </> : ""
                        }

                  </>
                )}
            </ModalContent>
        </Modal>
    </div>
  );
};
