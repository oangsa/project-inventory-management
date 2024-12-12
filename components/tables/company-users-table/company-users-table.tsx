import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RenderCellUsersCompany } from "./company-rander-cell-users";
import { User } from "@/interfaces/controller-types";
import getDataByCookie from "@/libs/getUserByCookie";
import TablePagination from "../paginations";
export const revalidate = 1
export const dynamic = 'force-dynamic'

import TimeAgo from 'javascript-time-ago'

import en from "../../../node_modules/javascript-time-ago/locale/en-001.json"
import getUsers from "@/libs/UserHandlers/getUsers";
import getCookieValue from "@/libs/getCookieValue";

export const TableWrapperCompanyUser = ({query, page}: {query: string, page: string}) => {
  const pg = parseInt(page) ?? 1

  const [data, setData] = useState<User[]>([])

  useEffect(() => {
    try {
        TimeAgo.setDefaultLocale(en.locale)
        TimeAgo.addLocale(en)
    }
    catch (error) {
        console.error(error)
    }

    async function fetchUsers() {
      const user = await getCookieValue()
      const res = await getUsers()

      const filterData: User[] = (res.users as User[]).filter((item) => {
        // Ignore admin and query's user
        // if (item.name.toLowerCase().includes("owner".toLowerCase())) return;
        if (item.id == user.id) return;

        return item.name.toLowerCase().includes(query.toLowerCase())
      })

      setData(filterData)
    }
    fetchUsers()
  }, [query])

  const rowsPerPage = 10;

  const items = React.useMemo(() => {
    const start = (pg - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [data, pg]);

  const columns = [
    {uid: 'name', name: "Name"},
    {uid: 'username', name: 'Username'},
    {uid: 'branch', name: "Branch Name"},
    {uid: 'role', name: 'Role'},
    {uid: 'join_date', name: 'Join Date'},
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
                  {RenderCellUsersCompany({ user: item, columnKey: columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
