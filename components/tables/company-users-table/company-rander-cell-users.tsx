import { Tooltip } from "@nextui-org/react";
import React from "react";

//Icons
import { User } from "@/interfaces/controller-types";

export const RenderCellUsersCompany = ({ user, columnKey }: {user: User, columnKey: any}) => {
    
    // @ts-ignore
    const cellValue = user[columnKey];

    // console.log(user)

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
                        {/* <EditProduct {...product}/> */}
                    </div>
                    <div>
                        <Tooltip content={"Delete"} color="danger">
                            {/* <DeleteProduct id={product.id} name = {product.name} branchName={product.useInBranch.name} /> */}
                        </Tooltip>
                    </div>
                </div>
            );
        default:
            return cellValue;
    }
};