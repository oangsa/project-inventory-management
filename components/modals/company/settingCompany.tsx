"use client"

import { Company, User } from "@/interfaces/controller-types"
import deleteCompanyHandler from "@/libs/CompanyHandler/deleteCompany"
import getCompanyById from "@/libs/CompanyHandler/getCompanyByid"
import updateCompany from "@/libs/CompanyHandler/updateCompany"
import getDataByCookie from "@/libs/getUserByCookie"
import { Input, Divider, Button, Card, ModalFooter, ModalHeader, ModalContent, Modal, ModalBody, useDisclosure } from "@nextui-org/react"
import { ChangeEvent, ReactNode, useEffect, useState } from "react"
import toast from "react-hot-toast"


export default function SettingCompany({query}: {query: string}) {
   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const [data, setData] = useState<Company>({} as Company)
   const [oldData, setOldData] = useState<Company>({} as Company)

   const [isClicked, setIsClicked] = useState<boolean>(false)
   const [hasData, setHasData] = useState<boolean>(false)

   const [companyNameInput, setCompanyNameInput] = useState<string>("");

   const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      setData((prev) => ({...prev, [name]: value}))
   }

   useEffect(() => {
      async function getData() {
         const res = await getCompanyById(query);
         setHasData(false)

         if (res.status != 200) {
            setHasData(false)
         }

         setHasData(true)
         setData(res.company as Company)
         setOldData(res.company as Company)

      }
      getData()
    }, [query])

    const btnSubmit = async () => toast.promise(
      submit(),
         {
            loading: 'Saving...',
            success: (data) => {
               return <b>Saved!</b>
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
         const user = await getDataByCookie();

         setIsClicked(true)

         if (!data.name) throw new Error("Please fill all the fields")

         const updated = await updateCompany(data, oldData, user.user as User);

         if (updated.status != 200) {
            throw new Error(updated.message as string)
         }

         setTimeout(() => window.location.reload(), 3010)

         return updated
       }

       const notify = async () => toast.promise(
         delSubmit(),
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

   const delSubmit = async() => {

      setIsClicked(true)

      if (companyNameInput !== data.name) {
         throw new Error(" Company name does not match.");
      }

      const res = await deleteCompanyHandler(data.id);

      if (res.status != 200) throw new Error(res.message as string)

      setTimeout(() => window.location.reload(), 3010)

      return res
   }


   return (
      <>
         <div className="flex flex-col gap-4">
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
               <Input isDisabled={!hasData || isClicked} value={data.name ? data.name : ""} onInput={inputHandler} name="name" label="Company name" variant="flat" labelPlacement={"outside"} placeholder="Company name"/>
            </div>
            <Divider className="mt-4"/>
            <Button onPress={btnSubmit} isLoading={isClicked} isDisabled={!hasData} className="xl:max-w-[50px]" color="primary" >Save</Button>
            <Divider className="mt-4"/>
            {/* <div className="h-1 font-bold text-xl text-red-500">Danger Zone</div> */}
            <Card className="border border-red-500 max-w-[500px]">
               <div className="p-4">
                  <h2 className="text-red-500 font-bold text-xl">Danger Zone</h2>
                  <p className="text-red-500">Be careful with the actions you perform here.</p>
                  <div className="pt-4">
                     <Button isDisabled={!hasData || isClicked} onPress={onOpen} color="danger"> Delete Company </Button>
                  </div>
               </div>
            </Card>
         </div>
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
                        <p className="text-md">This can&apos;t be changed. This will permanently delete the &apos;<span className="text-red-500 font-bold">{data.name}</span>&apos; remove all branches, products and employee data.</p>
                        <div className="mt-4">
                           <p className="text-md font-bold mb-2">Please type in your company&apos;s name to confirm.</p>
                           <Input value={companyNameInput} onValueChange={setCompanyNameInput} type="text" variant="flat" placeholder="Company name" name="companyName"/>
                        </div>
                     </ModalBody>
                     <ModalFooter className="justify-end">
                        <Button isDisabled={isClicked} variant="flat" onPress={onClose}>
                           Cancel
                        </Button>
                        <Button isDisabled = {companyNameInput !== data.name} isLoading={isClicked} color="danger" onPress={notify}>
                           Confirm
                        </Button>
                     </ModalFooter>
                  </>
                )}
            </ModalContent>
        </Modal>
      </>
   )
}
