import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination} from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { RenderCellBranchCompany } from "./render-cell-company-branch";
import { Branch } from "@/interfaces/controller-types";;
import TablePagination from "../paginations";
export const revalidate = 1
export const dynamic = 'force-dynamic'

import TimeAgo from 'javascript-time-ago'

import en from "../../../node_modules/javascript-time-ago/locale/en-001.json"
import getBranches from "@/libs/CompanyHandler/branchesGet";

export const TableWrapperCompanyBranch = ({query, page}: {query: string, page: string}) => {
   const pg = parseInt(page) ?? 1

   const [data, setData] = useState<Branch[]>([])

   const fetchProducts = useCallback(async () => {

      const res = await getBranches() as Branch[]

      let filterData: Branch[] = res.filter((item) => {
         return item.name.toLowerCase().includes(query.toLowerCase())
      })

      setData(filterData)
   }, [query])

   useEffect(() => {
      try {
         TimeAgo.setDefaultLocale(en.locale)
         TimeAgo.addLocale(en)
      }
      catch (error) {
         console.error(error)
      }
      fetchProducts()
   }, [query, fetchProducts])

  const rowsPerPage = 10;

  const items = React.useMemo(() => {
    const start = (pg - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [data, pg]);

  const columns = [
    {uid: 'name', name: "Branch Name"},
    {uid: 'productCount', name: "Total Products"},
    {uid: 'userCount', name: "Total Employee"},
    {uid: 'actions', name: 'Actions'}
  ]


  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells" bottomContent={
        <div className="flex w-full justify-center">
          <TablePagination length={data.length}/>
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RenderCellBranchCompany({ branch: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
