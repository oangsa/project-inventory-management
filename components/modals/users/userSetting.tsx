import { Button, DropdownItem, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { Branch, Company, roles, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import updateUserHandler from "@/libs/UserHandlers/updateUser";
import getDataByCookie from "@/libs/getUserByCookie";

export const UserSetting = (user: User) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState<User>({} as User);
  const [isClicked, setIsClicked] = useState<boolean>(false);

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

  const notify = async () => toast.promise(
    submit(),
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
            duration: 3000
        }
    }
)

  const submit = async() => {

    setIsClicked(true)

    const editor = await getDataByCookie();

    const updated = await updateUserHandler(user.role, user.branchId, data, user, editor.user as User);

    if (updated.status != 200) {
        throw new Error(updated.message as string)
    }

    setTimeout(() => window.location.reload(), 3010)

    return updated

  }

  return (
    <div>
      <>
         <button className="font-bold h-1" onClick={onOpen}>
            Settings
         </button>
         <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
         >
            <ModalContent>
            {(onClose) => (
               <>
                  <ModalHeader className="flex flex-col gap-1">
                     Settings
                  </ModalHeader>
                  <ModalBody>
                     <div className="flex flex-col gap-4">
                        {/* <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                           <Input value={data.name} onInput={inputHandler} name="name" label="name" variant="flat" labelPlacement={"outside"} placeholder="name"/>
                        </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                           <Input value={data.username} onInput={inputHandler} name="username" label="username" variant="flat" labelPlacement={"outside"} placeholder="username"/>
                        </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                           <Input value={data.password} onInput={inputHandler} name="password" label="password" variant="flat" labelPlacement={"outside"} placeholder="password"/>
                        </div> */}
                     </div>
                  </ModalBody>
                  <ModalFooter>
                     <Button isDisabled={isClicked} color="danger" variant="flat" onClick={onClose}>
                        Cancel
                     </Button>
                     <Button isLoading={isClicked} color="warning" onClick={notify}>
                        Update
                     </Button>
                  </ModalFooter>
               </>
            )}
            </ModalContent>
         </Modal>
      </>
   </div>
  );
};
