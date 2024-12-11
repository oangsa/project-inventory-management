"use client"

import { Button, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useActionState, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, Company, Product, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import getCompany from "@/libs/CompanyHandler/getCompany";
import mergeBranchAction from "@/libs/Actions/MergeBranchAction";

interface Selector {
   key: string,
   name: string
}

const priceSelect: Selector[] = [
   {key: "lower", name: "Keep Lower"},
   {key: "higher", name: "Keep Higher"}
]

export const MergeBranchBtn = () => {
   const [response, formAction, isPending] = useActionState(mergeBranchAction, null);

   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const [data, setData] = useState<Product>({} as Product);

   const [branchList, setBranchList] = useState<Selector[]>([]);
   const [branch, setBranch] = useState<Set<string>>(new Set());

   const [toMergeBranchList, setToMergeBranchList] = useState<Selector[]>([]);
   const [toMergeBranch, setToMergeBranch] = useState<Set<string>>(new Set());

   const [priceModeList, setPriceModeList] = useState<Selector[]>([]);
   const [priceMode, setPriceMode] = useState<Set<string>>(new Set());

   const [branchNameInput, setBranchNameInput] = useState<string>("");
   const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

   const [toastId, setToastId] = useState<string>("GAY");

   function resetState() {
         setData({} as Product)
         setBranch(new Set())
         setToMergeBranch(new Set())
         if (response) {
            response.status = 0;
         }

         setTimeout(() => {
            window.location.reload()
         }, 1100);
   }

   useEffect(() => {
      async function getData() {
         const user = await getDataByCookie();

         if (user.status != 200) throw new Error(user.message as string)

         const c = await getCompany(user.user as User);

         const branches = (c.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))

         setBranchList(branches)
         setToMergeBranchList(branches)
         setPriceModeList(priceSelect)

      }
      getData()
   }, [])


   const submit = async(queryData: FormData): Promise<void> => {
      await formAction(queryData)

      toast.loading('Merging...', {
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
         return;
      }

      else if (response?.status == 200) {
         resetState()
         toast.success(response?.message as string, {
            id: toastId
         });
         return;
      }
   }, [isPending, response, toastId]);

  return (
    <div>
      <>
        <Tooltip content="Merge Branch">
              <Button color="danger" onPress={onOpen}>
                Merge Branch
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
                    Merge Branch System
                </ModalHeader>
                <form action={submit}>
                  <ModalBody>
                     <div className="flex flex-col gap-4">
                        <Divider/>
                           <div className="flex w-full flex-wrap md:flex-nowrap mb-3 md:mb-0 gap-4">
                              <p className="text-red-500 font-medium">This action will delete all the selected branch and combine them to the another branches.</p>
                           </div>
                           <div>
                              <p className="text-md font-bold pb-2">Check the checkbox below to continue.</p>
                              <Checkbox isSelected={isConfirmed} onValueChange={setIsConfirmed} color="danger">Continue</Checkbox>
                           </div>
                        <Divider/>
                        {
                           isConfirmed && (
                              <>
                                 <p className="text-md font-bold pb-2">Select the branches to merge.</p>
                                 <div className="flex w-full flex-wrap md:flex-nowrap mb-3 md:mb-0 gap-4">
                                    <Select
                                       label="Branch"
                                       name="assignedBranch"
                                       isDisabled={isPending}
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
                                 <div className="flex w-full flex-wrap md:flex-nowrap mb-3 md:mb-0 gap-4">
                                    <Select
                                       label="Megre to branch"
                                       name="mergeToBranch"
                                       isDisabled={isPending}
                                       selectedKeys={toMergeBranch}
                                       onSelectionChange={(keys) => setToMergeBranch(new Set(Array.from(keys).map(String)))}
                                       variant="flat"
                                       labelPlacement={"outside"}
                                       placeholder="Select Branch"
                                    >
                                       {toMergeBranchList.map((branch) => (
                                          <SelectItem key={branch.key} value={branch.key}>
                                                {branch.name}
                                          </SelectItem>
                                       ))}
                                    </Select>
                                 </div>
                                 <div className="flex w-full flex-wrap md:flex-nowrap mb-3 md:mb-0 gap-4">
                                    <Select
                                       label="Price Mode"
                                       name="priceMode"
                                       isDisabled={isPending}
                                       selectedKeys={priceMode}
                                       onSelectionChange={(keys) => setPriceMode(new Set(Array.from(keys).map(String)))}
                                       variant="flat"
                                       labelPlacement={"outside"}
                                       placeholder="Select Mode"
                                    >
                                       {priceModeList.map((branch) => (
                                          <SelectItem key={branch.key} value={branch.key}>
                                                {branch.name}
                                          </SelectItem>
                                       ))}
                                    </Select>
                                 </div>
                                 {
                                    (branch.values().next().value == toMergeBranch.values().next().value) && (branch.values().next().value != null || toMergeBranch.values().next().value != null) ?
                                    <p className="text-red-500">Branches can't be the same</p>
                                    :
                                    (branch.values().next().value == null || toMergeBranch.values().next().value == null) ? "" :
                                    <div className="mt-2">
                                       <p className="text-md font-bold pb-2">Please type in the name of the branch to confirm.</p>
                                       <Input value={branchNameInput} onValueChange={setBranchNameInput} type="text" variant="flat" placeholder="Branch name" name="branchName"/>
                                    </div>
                                 }
                              </>
                           )
                        }
                     </div>
                  </ModalBody>
                  <ModalFooter>
                     <Button isDisabled={isPending} color="danger" variant="flat" onPress={onClose}>
                        Cancel
                     </Button>
                     <Button isDisabled={(branch.values().next().value == toMergeBranch.values().next().value) || (branchList.find((b) => b.key === branch.values().next().value)?.name != branchNameInput)} isLoading={isPending} color="primary" type="submit">
                        Confirm
                     </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
