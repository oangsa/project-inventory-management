import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEventHandler, ReactNode, useState } from "react";
import toast from 'react-hot-toast';
import { FaTrashCan } from "react-icons/fa6";
import deleteBranchHandler from "@/libs/CompanyHandler/branchDelete";

export const DeleteBranch = ({id, branchName} : {id: string, branchName: string}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [branchNameInput, setBranchNameInput] = useState<string>("");


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

    if (branchNameInput !== branchName) {
        throw new Error(" Branch name does not match.");
    }

    const res = await deleteBranchHandler(id);

    if (res.status != 200) throw new Error(res.message as string)

    setTimeout(() => window.location.reload(), 3010)

    return res

  }

  return (
    <div>
      <>
        <Tooltip content="Delete Branch" color="danger">
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
                <ModalHeader className="flex gap-1 text-2xl">
                    Are you absolutly sure?
                </ModalHeader>
                <Divider></Divider>
                <ModalBody className="flex">
                    <p className="text-md">This can&apos;t be changed. This will permanently delete the &apos;<span className="text-red-500 font-bold">{branchName}</span>&apos; branch and remove all products and employee data.</p>
                    <div className="mt-4">
                        <p className="text-md font-bold">Please type in the name of the branch to confirm.</p>
                        <Input value={branchNameInput} onValueChange={setBranchNameInput} type="text" variant="flat" placeholder="Branch name" name="branchName"/>
                    </div>
                </ModalBody>
                <ModalFooter>
                  <Button isDisabled={isClicked} variant="flat" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={isClicked} color="danger" onClick={notify}>
                    Confirm
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
