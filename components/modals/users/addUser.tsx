"use client"

import { Select, SelectItem ,Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, select, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, Company, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import userRegis from "@/libs/UserHandlers/userRegis";
import getCompany from "@/libs/CompanyHandler/getCompany";

interface UserCreate extends User {
    token: string
    assignedBranch: string,
    assignedRole: string
}

interface Selector {
    key: string,
    name: string
}

export const AddUserBtn = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState<UserCreate>({} as UserCreate);

  const [branchList, setBranchList] = useState<Selector[]>([]);
  const [roleList, setRoleList] = useState<Selector[]>([]);

  const [branch, setBranch] = useState<Set<[]>>(new Set([]));
  const [role, setRole] = useState<Set<[]>>(new Set([]));

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

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

    const b = branch.values().next().value as unknown as string
    const r = role.values().next().value as unknown as string

    setIsClicked(true)

    const user = await getDataByCookie();

    if (user.status != 200) throw new Error(user.message as string)

    const res = await userRegis(data.username, data.password, data.name, data.token, "", r, b, user.user as User);

    if (res.status != 200) throw new Error(res.message as string)

    setTimeout(() => window.location.reload(), 3010)

    return res

  }

  useEffect(() => {
    async function getCompanyData() {
      const user = await getDataByCookie();

      let Roles: roleSelect[];

      let Branches: branchSelect[];

      if (user.status != 200) throw new Error(user.message as string)

      const c = await getCompany(user.user as User);


      if ((user.user as User).role == "admin") {
         Branches = (c.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))
         Roles = [
            {key: "admin", name: "admin"},
            {key: "manager", name: "manager"},
            {key: "employee", name: "employee"},
         ]
      }
      else {
         Branches = [{key: (user.user as User).branchId, name: (user.user as User).branch.name}]
         Roles = [
            {key: "employee", name: "employee"},
         ]
      }

      setBranchList(Branches)
      setRoleList(Roles)
    }
    getCompanyData()
  }, [])


  return (
    <div>
      <>
        <Tooltip content="Add User">
              <Button color="primary" onClick={onOpen}>
                Add User
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
                    Add User
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.name ? data.name : ""} onInput={inputHandler} name="name" label="Name" variant="flat" labelPlacement={"outside"} placeholder="name"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.username ? data.username : ""} onInput={inputHandler} name="username" label="Username" variant="flat" labelPlacement={"outside"} placeholder="username"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.password ? data.password : "" } onInput={inputHandler} name="password" label="Password" variant="flat" labelPlacement={"outside"} placeholder="password"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Select
                            label="Branch"
                            name="assignedBranch"
                            // value={data.assignedBranch ? data.assignedBranch : ""}
                            selectedKeys={branch}
                            onSelectionChange={setBranch}
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
                            onSelectionChange={setRole}
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
                  <Button isLoading={isClicked} color="primary" onClick={notify}>
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
