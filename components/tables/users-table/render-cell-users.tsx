import { Tooltip } from "@nextui-org/react";
import React from "react";

//Icons
import { User } from "@/interfaces/controller-types";
import { DeleteUser } from "@/components/modals/users/deleteUser";
import { EditUser } from "@/components/modals/users/editUser";

export const RenderCellUsers = ({ user, columnKey }: {user: User, columnKey: any}) => {

    // @ts-expect-error
    const cellValue = user[columnKey];

    switch (columnKey) {
        case "branch":
            return (
                <div>
                    <span>{user.branch.name}</span>
                </div>
            );

        case "join_date":
            return (
                <div>
                    <span>{user.joinDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }).replace(/(.*)\D\d+/, '$1')}</span>
                </div>
            );

        case "actions":
            return (
                <div className="flex items-center gap-4 ">
                    <div>
                        <EditUser {...user}/>
                    </div>
                    <div>
                        <Tooltip content={"Delete"} color="danger">
                            <DeleteUser id={user.id} name = {user.name} branchName={user.branch.name} />
                        </Tooltip>
                    </div>
                </div>
            );
        default:
            return cellValue;
    }
};
