import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, } from "@nextui-org/react";
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { Product } from "@/interfaces/controller-types";
import updateProductHandler from "@/libs/ProductHandler/productUpdate";
import toast from 'react-hot-toast';

export const EditProduct = (product: Product) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState<Product>({} as Product);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name == "remain" || name == "price") {
        if (isNaN(parseInt(value)))
            return setData((prev) => ({...prev, [name]: 0}))

        if (name === "price")
            return setData((prev) => ({...prev, [name]: parseFloat(value)}))

        return setData((prev) => ({...prev, [name]: parseInt(value)}))
    }
    setData((prev) => ({...prev, [name]: value}))
  }

  const getData = useCallback(async () => {
    return setData(product)
  }, [product])

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

    setIsClicked(true)

    if (data.productCode === "" || data.name === "" || data.remain === 0 || data.price === 0) throw new Error("Please fill all fields.");


    const updated = await updateProductHandler(data, product);

    if (updated.status != 200) {
        throw new Error(updated.message as string)
    }

    setTimeout(() => window.location.reload(), 3010)

    return updated


  }

  return (
   <div>
      <>
         <Tooltip content="Update Product" color="secondary">
            <button onClick={onOpen}>
               <FaEdit size={20} fill="#979797" />
            </button>
         </Tooltip>
         <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
            <ModalContent>
               {(onClose) => (
                  <>
                     <ModalHeader className="flex flex-col gap-1">
                        Update Product
                     </ModalHeader>
                     <ModalBody>
                        <div className="flex flex-col gap-4">
                           <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                              <Input value={data.productCode} onInput={inputHandler} name="productCode" label="Product Code" variant="flat" labelPlacement={"outside"} placeholder="Product name"/>
                           </div>
                           <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                              <Input value={data.name} onInput={inputHandler} name="name" label="Product name" variant="flat" labelPlacement={"outside"} placeholder="Product name"/>
                           </div>
                           <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                              <Input value={data.remain.toString()} onInput={inputHandler} name="remain" label="Remaining" variant="flat" labelPlacement={"outside"} placeholder="Remaining"/>
                           </div>
                           <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                              <Input type="number" value={data.price.toString()} onInput={inputHandler} name="price" label="Price" variant="flat" labelPlacement={"outside"} placeholder="Product Price"/>
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
