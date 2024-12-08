import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure, } from "@nextui-org/react";
import React, { ReactNode, useState } from "react";
import toast from 'react-hot-toast';
import { FaTrashCan } from "react-icons/fa6";
import userDeleteHandler from "@/libs/UserHandlers/userDelete";

export const DeleteUser = ({id, name, branchName} : {id: string, name: string, branchName: string}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isClicked, setIsClicked] = useState<boolean>(false);


  const notify = async () => toast.promise(
    submit(),
    {
        loading: 'Deleting...',
        success: (data: any) => {
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

    const res = await userDeleteHandler(id);

    if (res.status != 200) throw new Error(res.message as string)

    setTimeout(() => window.location.reload(), 3010)

    return res

  }

  return (
    <div>
      <>
        <Tooltip content="Delete User" color="danger">
            <button onClick={onOpen} >
                <FaTrashCan size={20} fill="#FF0080" />
            </button>
        </Tooltip>
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
                <ModalBody className="flex items-center">
                    <p className="font-bold">'{name}' in '{branchName}' will permanently deleted!</p>
                    <p>This can't be changed</p>
                </ModalBody>
                <ModalFooter>
                  <Button isDisabled={isClicked} variant="flat" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={isClicked} color="danger" onClick={notify}>
                    Yes
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
