import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RenderCellBranchCompany } from "./render-cell-company-branch";
import { Branch, Company, Product, User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";
import TablePagination from "../paginations";
import getCompanyProducts from "@/libs/ProductHandler/productGetsFilterByCompany";
export const revalidate = 1
export const dynamic = 'force-dynamic'

import TimeAgo from 'javascript-time-ago'

import en from "../../../node_modules/javascript-time-ago/locale/en-001.json"
import getCompany from "@/libs/CompanyHandler/getCompany";
import getBranches from "@/libs/CompanyHandler/branchesGet";

export const TableWrapperCompanyBranch = ({query, page}: {query: string, page: string}) => {
  const pg = parseInt(page) ?? 1

  const [data, setData] = useState<Branch[]>([])

  useEffect(() => {
    try {
        TimeAgo.setDefaultLocale(en.locale)
        TimeAgo.addLocale(en)
    }
    catch (error) {
        console.error(error)
    }

    async function fetchBranch() {
        const editor = await getDataByCookie();

        const branch = await getBranches(editor.user as User);

        const filterData: Branch[] = (branch.branches as Branch[]).filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase())
        })

        setData(filterData)
    }
    fetchBranch()
  }, [query])

  const rowsPerPage = 10;

  const items = React.useMemo(() => {
    const start = (pg - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data, pg]);

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
