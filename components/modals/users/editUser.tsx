import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { Branch, Company, roles, User } from "@/interfaces/controller-types";
import updateProductHandler from "@/libs/ProductHandler/productUpdate";
import toast from 'react-hot-toast';
import updateUserHandler from "@/libs/UserHandlers/updateUser";
import getDataByCookie from "@/libs/getUserByCookie";
import getCompany from "@/libs/CompanyHandler/getCompany";

interface Selector {
    key: string,
    name: string
}

export const EditUser = (user: User) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState<User>({} as User);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [branchList, setBranchList] = useState<Selector[]>([]);
  const [roleList, setRoleList] = useState<Selector[]>([]);

  const [branch, setBranch] = useState<Set<string>>(new Set());
  const [role, setRole] = useState<Set<string>>(new Set());

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    console.log(name, value)

    setData((prev) => ({...prev, [name]: value}))
  }

  const getData = useCallback(async () => {
    const editor = await getDataByCookie();

    const c = await getCompany(editor.user as User);

    const branch = (c.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))

    const roles = [
        {key: "manager", name: "manager"},
        {key: "employee", name: "employee"},
    ]

    setBranchList(branch)
    setRoleList(roles)

    setBranch(new Set([user.branchId]))
    setRole(new Set([user.role]))

    return setData(user)
  }, [user])

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

    const b = branch.values().next().value as unknown as string
    const r = role.values().next().value as unknown as roles

    setIsClicked(true)

    const editor = await getDataByCookie();

    const updated = await updateUserHandler(r, b, data, user, editor.user as User);

    if (updated.status != 200) {
        throw new Error(updated.message as string)
    }

    setTimeout(() => window.location.reload(), 3010)

    return updated

  }

  return (
    <div>
      <>
        <Tooltip content="Update User" color="secondary">
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
                    Update User
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.name} onInput={inputHandler} name="name" label="name" variant="flat" labelPlacement={"outside"} placeholder="name"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.username} onInput={inputHandler} name="username" label="username" variant="flat" labelPlacement={"outside"} placeholder="username"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input onInput={inputHandler} name="password" label="password" variant="flat" labelPlacement={"outside"} placeholder="password"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Select
                            label="Branch"
                            name="assignedBranch"
                            // value={data.assignedBranch ? data.assignedBranch : ""}
                            selectedKeys={branch}
                            onSelectionChange={(keys) => setBranch(new Set(Array.from(keys).map(String)))}
                            variant="flat"
                            labelPlacement={"outside"}
                            placeholder="Select Branch"
                        >
                            {branchList.map((branch) => (
                                <SelectItem key={branch.key} value={branch.key}>
                                    {branch.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Select
                            label="Role"
                            name="assignedRole"
                            // value={data.assignedRole ? data.assignedRole : ""}
                            selectedKeys={role}
                            onSelectionChange={(keys) => setRole(new Set(Array.from(keys).map(String)))}
                            variant="flat"
                            labelPlacement={"outside"}
                            placeholder="Select Role"
                        >
                            {roleList.map((role) => (
                                <SelectItem key={role.key} value={role.key}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
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
