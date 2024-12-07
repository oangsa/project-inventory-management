import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RenderCellProductCompany } from "./render-cell-company-product";
import { Product, User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";
import TablePagination from "../paginations";
import getCompanyProducts from "@/libs/ProductHandler/productGetsFilterByCompany";
export const revalidate = 1
export const dynamic = 'force-dynamic'

import TimeAgo from 'javascript-time-ago'

import en from "../../../node_modules/javascript-time-ago/locale/en-001.json"

export const TableWrapperCompanyProduct = ({query, page}: {query: string, page: string}) => {
  const pg = parseInt(page) ?? 1

  const [data, setData] = useState<Product[]>([])

  useEffect(() => {
    try {
        TimeAgo.setDefaultLocale(en.locale)
        TimeAgo.addLocale(en)
    }
    catch (error) {
        console.error(error)
    }

    async function fetchProducts() {
      let user = await getDataByCookie();
      let res = await getCompanyProducts(user.user as User)

      const filterData: Product[] = res.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
      })

      setData(filterData)
    }
    fetchProducts()
  }, [query, TimeAgo])

  const rowsPerPage = 10;

  const items = React.useMemo(() => {
    const start = (pg - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  const columns = [
    {uid: 'productCode', name: "Product Code"},
    {uid: 'name', name: "Product Name"},
    {uid: 'branch', name: "Branch Name"},
    {uid: 'remain', name: 'Remain'},
    {uid: 'price', name: 'Price'},
    {uid: 'last_edit', name: 'Last Edit'},
    {uid: 'last_restock', name: 'Last Restock'},
    {uid: 'actions', name: 'Actions'}
  ]

  // useEffect(() => {
  //   get()
  // }, [])


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
                  {RenderCellProductCompany({ product: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
