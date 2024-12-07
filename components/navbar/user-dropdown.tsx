import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalContent, ModalFooter, ModalHeader, NavbarItem, useDisclosure, } from "@nextui-org/react";
import React, { ReactNode, useState } from "react";
import { logoutHandler } from "@/libs/UserHandlers/logout";
import toast from "react-hot-toast";

interface props {
  image: string,
  name: string,
  companyName: string
}

export const UserDropdown = ({image, name, companyName}: props) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isClicked, setIsClicked] = useState<boolean>(false);
    var url = image

    if ( image === 'url' || image === '' ) url = 'https://i.pravatar.cc/150?u=a042581f4e29026704d'

    const notify = async () => toast.promise(
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
                duration: 1000
            }
        }
    )

    const submit = async() => {
        setIsClicked(true)
        const res = await logoutHandler();

        if (res.status != 200) throw new Error(res.message as string);

        setTimeout(() => window.location.reload(), 1010)

        return res

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
                if (actionKey === 'logout') return onOpen();
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
                    <ModalHeader className="justify-center flex gap-1 text-2xl">
                        Are you sure?
                    </ModalHeader>
                    <ModalFooter>
                    <Button isDisabled={isClicked} variant="light" color="danger" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button isLoading={isClicked} color="primary" onClick={notify}>
                        Yes
                    </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
        </Modal>
    </div>
  );
};
