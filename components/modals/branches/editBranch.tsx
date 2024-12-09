import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { Branch, roles, User, providers } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import updateBranchHandler from "@/libs/CompanyHandler/updateBranch";

interface providerSelect {
   key: providers,
   name: string
}

const providerLists: providerSelect[] = [
   {key: "line", name: "Line"},
   {key: "discord", name: "Discord"},
]

export const EditBranch = (branch: Branch) => {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();
   const [data, setData] = useState<Branch>({} as Branch);
   const [isClicked, setIsClicked] = useState<boolean>(false);

   const [providerList, setProviderList] = useState<providerSelect[]>(providerLists);

   const [provider, setProvider] = useState<Set<string>>(new Set());

   const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      console.log(name, value)

      setData((prev) => ({...prev, [name]: value}))
   }

   const getData = useCallback(async () => {
      setProvider(new Set([branch.provider]))

      return setData(branch)
   }, [branch])

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
      const d = {
         name: data.name,
         lowestNoti: data.lowestNoti,
         provider: provider.values().next().value as unknown as providers,
         dependencies: data.dependencies
      } as Branch

      setIsClicked(true)

      if (!d.name || !d.lowestNoti || !d.provider || !d.dependencies) throw new Error("Please fill all the fields")

      if (d.provider == "line") throw new Error("Line is not supported yet.");

      if (!d.dependencies) throw new Error("Discord Webhook is required.");

      const updated = await updateBranchHandler(d, branch);

      if (updated.status != 200) {
         throw new Error(updated.message as string)
      }

      setTimeout(() => window.location.reload(), 3010)

      return updated
    }

  return (
    <div>
      <>
        <Tooltip content="Update Branch" color="secondary">
              <button onClick={onOpen}>
                <FaEdit size={20} fill="#979797" />
              </button>
         </Tooltip>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                    Update Branch
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.name ? data.name : ""} onInput={inputHandler} name="name" label="Branch name" variant="flat" labelPlacement={"outside"} placeholder="Branch name"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input type="number" value={data.lowestNoti ? data.lowestNoti.toString() : "" } onInput={inputHandler} name="lowestNoti" label="Threashold" variant="flat" labelPlacement={"outside"} placeholder="Threashold"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Select
                            label="Notification Provider"
                            name="provider"
                            // value={data.assignedRole ? data.assignedRole : ""}
                            selectedKeys={provider}
                            onSelectionChange={(keys) => setProvider(new Set(Array.from(keys).map(String)))}
                            variant="flat"
                            labelPlacement={"outside"}
                            placeholder="Select Provider"
                        >
                            {providerList.map((provider) => (
                                <SelectItem key={provider.key} value={provider.key}>
                                    {provider.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    {
                        provider.values().next().value as unknown as providers == "line" ?
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input color="danger" disabled value={"Currently not support"} name="lowestnoti" label="Line" variant="flat" labelPlacement={"outside"} placeholder="Currently not support"/>
                        </div>
                        : provider.values().next().value as unknown as providers == "discord" ?
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input value={data.dependencies ? data.dependencies : "" } onInput={inputHandler} name="dependencies" label="Discord Webhook" variant="flat" labelPlacement={"outside"} placeholder="Discord Webhook"/>
                        </div>
                        : ""
                    }
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
