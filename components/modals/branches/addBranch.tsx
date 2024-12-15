import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, providers, roles, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import branchCreate from "@/libs/CompanyHandler/createBranch";
import getCookieValue from "@/libs/getCookieValue";

interface providerSelect {
    key: providers,
    name: string
}

const providerLists: providerSelect[] = [
    {key: "line", name: "Line"},
    {key: "discord", name: "Discord"},
]

export const AddBranchBtn = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState<Branch>({} as Branch);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [providerList, setProviderList] = useState<providerSelect[]>(providerLists);

  const [provider, setProvider] = useState<Set<string>>(new Set());

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name == "lowestNoti") {
        if (isNaN(parseInt(value)))
            return setData((prev) => ({...prev, [name]: 0}))

        return setData((prev) => ({...prev, [name]: parseInt(value)}))
    }
    setData((prev) => ({...prev, [name]: value}))
  }


  const notify = async () => toast.promise(
    submit(),
    {
        loading: 'Adding...',
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
    const p = provider.values().next().value as unknown as providers

    setIsClicked(true)

    if (!data.name || !data.lowestNoti || !p || !data.dependencies) throw new Error("Please fill all the fields")

    const user = await getCookieValue();

    const res = await branchCreate(data.name, p, data.dependencies, data.lowestNoti, user.company, user as User);

    if (res.status != 200) throw new Error(res.message as string)

    setTimeout(() => window.location.reload(), 3010)

    return res

  }

  return (
    <div>
      <>
        <Tooltip content="Add Branch">
              <Button color="primary" onPress={onOpen}>
                Add Branch
              </Button>
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
                    Add Branch
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
                  <Button isDisabled={isClicked} color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={isClicked} color="primary" onPress={notify}>
                    Add
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
