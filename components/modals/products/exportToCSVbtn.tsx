"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure, } from "@nextui-org/react";
import React, { useActionState, useEffect, useState } from "react";
import { Tooltip } from "@nextui-org/react";
import { Branch, Company, Product } from "@/interfaces/controller-types";
import toast from 'react-hot-toast';
import getCompany from "@/libs/CompanyHandler/getCompany";
import exportProductAction from "@/libs/Actions/ExportAction";
import getCookieValue from "@/libs/getCookieValue";

interface Selector {
   key: string,
   name: string
}

const modeData: Selector[] = [
   {key: "normal", name: "Normal"},
   {key: "branch", name: "Branch"}
]

export const ExportToCSVBtn = () => {
   const [response, formAction, isPending] = useActionState(exportProductAction, null);

   const { isOpen, onOpen, onOpenChange } = useDisclosure();

   const [data, setData] = useState<Product>({} as Product);

   const [branchList, setBranchList] = useState<Selector[]>([]);
   const [branch, setBranch] = useState<Set<string>>(new Set());

   const [modeList, setModeList] = useState<Selector[]>([]);
   const [mode, setMode] = useState<Set<string>>(new Set());

   const [companyList, setCompanyList] = useState<Selector[]>([]);
   const [company, setCompany] = useState<Set<string>>(new Set());

   const [toastId, setToastId] = useState<string>("GAY");

   function resetState() {
      setData({} as Product)
      setBranch(new Set())
      if (response) {
         response.status = 0;
      }
   }

   function exportToCsv() {
      const data = response?.products as Product[]
      let csv = ""
      csv += "Code,Name,Remain,Full Stock,Branch\n"
      data.forEach((row) => {
         csv += `${row.productCode},${row.name},${row.remain},${row.fullStock},${row.useInBranch.name}\n`
      })
      csv = "data:application/csv," + encodeURIComponent(csv);
      const link = document.createElement("a");
      link.setAttribute("href", csv);
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }

   useEffect(() => {
      async function getData() {
         const c = await getCompany();

         const branches = (c.company as Company).Branch.map((branch: Branch) => ({key: branch.id, name: branch.name}))
         const companies = [{key: (c.company as Company).id, name: (c.company as Company).name}]

         setBranchList(branches)
         setModeList(modeData)
         setCompanyList(companies)

         setCompany(new Set([companies[0].key]))

      }
      getData()
   }, [])


   const submit = async(queryData: FormData): Promise<void> => {
      await formAction(queryData)

      toast.loading('Downloading...', {
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
         exportToCsv()
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
        <Tooltip content="Export To CSV">
              <Button color="secondary" onPress={onOpen}>
                Export
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
                    Select Mode To Export
                </ModalHeader>
                <form action={submit}>
                  <ModalBody>
                     <div className="flex flex-col gap-4">
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-3 md:mb-0 gap-4">
                              <Select
                                 label="Mode"
                                 name="modeSelect"
                                 isDisabled={isPending}
                                 selectedKeys={mode}
                                 onSelectionChange={(keys) => setMode(new Set(Array.from(keys).map(String)))}
                                 variant="flat"
                                 labelPlacement={"outside"}
                                 placeholder="Select Mode"
                              >
                                 {modeList.map((mode) => (
                                    <SelectItem key={mode.key} value={mode.key}>
                                          {mode.name}
                                    </SelectItem>
                                 ))}
                              </Select>
                        </div>
                        {mode.has("branch") && (
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
                        )}
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-3 md:mb-0 gap-4">
                           <Select
                              label="Company"
                              name="company"
                              isDisabled={isPending}
                              selectedKeys={company}
                              variant="flat"
                              labelPlacement={"outside"}
                              placeholder="Select Company"
                           >
                              {companyList.map((company) => (
                                 <SelectItem key={company.key} value={company.key}>
                                       {company.name}
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
