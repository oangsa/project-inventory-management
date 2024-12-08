import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, Company, Product, User } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getDataByCookie from "@/libs/getUserByCookie";
import productCreate from "@/libs/ProductHandler/productCreate";
import getCompany from "@/libs/CompanyHandler/getCompany";

interface branchSelect {
   key: string,
   name: string
}

export const AddProductBtn = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState<Product>({} as Product);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [branchList, setBranchList] = useState<branchSelect[]>([]);

  const [branch, setBranch] = useState<Set<string>>(new Set());

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
      const d = {
         productCode: data.productCode,
         name: data.name,
         remain: data.remain,
         price: data.price,
         branchId: branch.values().next().value as unknown as string
      } as Product

    setIsClicked(true)

    const user = await getDataByCookie();

    if (user.status != 200) throw new Error(user.message as string)

    const res = await productCreate(d, user.user as User);

    if (res.status != 200) throw new Error(res.message as string)

    setTimeout(() => window.location.reload(), 3010)

    return res

  }

  return (
    <div>
      <>
        <Tooltip content="Add Product">
              <Button color="primary" onClick={onOpen}>
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
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.productCode ? data.productCode : ""} onInput={inputHandler} name="productCode" label="Product Code" variant="flat" labelPlacement={"outside"} placeholder="Product code"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.name ? data.name : ""} onInput={inputHandler} name="name" label="Product name" variant="flat" labelPlacement={"outside"} placeholder="Product name"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input value={data.remain ? data.remain.toString() : ""} onInput={inputHandler} name="remain" label="Remaining" variant="flat" labelPlacement={"outside"} placeholder="Remaining"/>
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                      <Input type="number" value={data.price ? data.price.toString() : "" } onInput={inputHandler} name="price" label="Price" variant="flat" labelPlacement={"outside"} placeholder="Product Price"/>
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
