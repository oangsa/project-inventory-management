"use client"

import { Select, SelectItem ,Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, select, } from "@nextui-org/react";
import React, { ChangeEvent, Key, ReactNode, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, Company, InviteCode, roles, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import userRegis from "@/libs/UserHandlers/userRegis";
import getCompany from "@/libs/CompanyHandler/getCompany";
import createInviteCode from "@/libs/UserHandlers/createInviteCode";

interface Selector {
    key: string,
    name: string
}

export const InviteCodeCreateBtn = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [branchList, setBranchList] = useState<Selector[]>([]);
  const [roleList, setRoleList] = useState<Selector[]>([]);

  const [branch, setBranch] = useState<Set<string>>(new Set());
  const [role, setRole] = useState<Set<string>>(new Set());

  const [isClicked, setIsClicked] = useState<boolean>(false);


  const notify = async () => toast.promise(
    submit(),
    {
        loading: 'Creating...',
        success: (data: any) => {
            setIsClicked(false);
            toast.success("Invite Code Copied to Clipboard")
            return (
                <div className="grid-rows-2 grid">
                    <b>{data?.message as ReactNode}</b>
                    <b className="font-bold text-red-500">{(data.token as InviteCode).code}</b>
                </div>
            )
        },
        error: (e) => {
            setIsClicked(false)
            return (
                <b>{e.message}</b>
            )},
    },
    {
        loading: {
            duration: 3000
        },
        success: {
            duration: 15000
        }
    }
)

  const submit = async() => {

    const b = branch.values().next().value as unknown as string
    const r = role.values().next().value as unknown as roles

    console.log(b, r)

    setIsClicked(true)

    const user = await getDataByCookie();

    if (user.status != 200) throw new Error(user.message as string)

    const res = await createInviteCode(r, b, user.user as User);

    if (res.status != 200) throw new Error(res.message as string)

    await navigator.clipboard.writeText((res.token as InviteCode).code)

    setTimeout(() => window.location.reload(), 3010)

    return res

  }

  useEffect(() => {
    async function getCompanyData() {
        const user = await getDataByCookie();

        if (user.status != 200) throw new Error(user.message as string)

        const c = await getCompany(user.user as User);

        const branch = (c.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))

        const roles = [
            {key: "manager", name: "manager"},
            {key: "employee", name: "employee"},
        ]

        setBranchList(branch)
        setRoleList(roles)
    }
    getCompanyData()
  }, [])


  return (
    <div>
      <>
        <Tooltip content="Create Invite Code">
              <Button color="secondary" onPress={onOpen}>
                Create Invite Code
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
                    Create Invite Code
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
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
                  <Button isDisabled={isClicked} color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={isClicked} color="primary" onPress={notify}>
                    Create
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
