"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useActionState, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, Company, Product, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import getCompany from "@/libs/CompanyHandler/getCompany";
import addProductAction from "@/libs/Actions/AddProductAction";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface branchSelect {
   key: string,
   name: string
}

export const AddProductBtn = () => {
   const [response, formAction, isPending] = useActionState(addProductAction, null);

   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const [data, setData] = useState<Product>({} as Product);

   const [branchList, setBranchList] = useState<branchSelect[]>([]);

   const [branch, setBranch] = useState<Set<string>>(new Set());

   const [toastId, setToastId] = useState<string>("GAY");

   function resetState() {
         setData({} as Product)
         setBranch(new Set())

         setTimeout(() => {
            window.location.reload()
         }, 1200);
   }

   const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      if (name == "remain" || name == "price") {
         if (isNaN(parseInt(value)))
            return setData((prev) => ({...prev, [name]: 0}))

         if (name === "price") {
         if (value === "." && !data.price.toString().includes(".")) {
            return setData((prev) => ({...prev, [name]: .0}))
         }

         return setData((prev) => ({...prev, [name]: parseFloat(value)}))
         }

         return setData((prev) => ({...prev, [name]: parseInt(value)}))
      }
      setData((prev) => ({...prev, [name]: value}))
   }

   useEffect(() => {
      async function getData() {
         const user = await getDataByCookie();

         if (user.status != 200) throw new Error(user.message as string)

         const c = await getCompany(user.user as User);

         const branch = (c.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))

         setBranchList(branch)

      }
      getData()
   }, [])


   const submit = async(queryData: FormData): Promise<void> => {
      await formAction(queryData)

      toast.loading('Adding...', {
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
      }

      else if (response?.status == 200) {
         resetState()
         toast.success(response?.message as string, {
            id: toastId
         });
      }
   }, [isPending, response]);

  return (
    <div>
      <>
        <Tooltip content="Add Product">
              <Button color="primary" onPress={onOpen}>
                Add Product
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
                    Add Product
                </ModalHeader>
                <form action={submit}>
                  <ModalBody>
                     <div className="flex flex-col gap-4">
                     <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input isDisabled={isPending} value={data.productCode ? data.productCode : ""} onInput={inputHandler} name="productCode" label="Product Code" variant="flat" labelPlacement={"outside"} placeholder="Product code"/>
                     </div>
                     <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input isDisabled={isPending} value={data.name ? data.name : ""} onInput={inputHandler} name="name" label="Product name" variant="flat" labelPlacement={"outside"} placeholder="Product name"/>
                     </div>
                     <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input isDisabled={isPending} value={data.remain ? data.remain.toString() : ""} onInput={inputHandler} name="remain" label="Remaining" variant="flat" labelPlacement={"outside"} placeholder="Remaining"/>
                     </div>
                     <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input isDisabled={isPending} type="number" value={data.price ? data.price.toString() : "" } onInput={inputHandler} name="price" label="Price" variant="flat" labelPlacement={"outside"} placeholder="Product Price"/>
                     </div>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
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
                     </div>

                  </ModalBody>
                  <ModalFooter>
                     <Button isDisabled={isPending} color="danger" variant="flat" onPress={onClose}>
                        Cancel
                     </Button>
                     <Button isLoading={isPending} color="primary" type="submit">
                        Add
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
