import { EditProduct } from "@/components/modals/products/editProduct";
import { Tooltip } from "@nextui-org/react";
import React from "react";

//Icons
import { Branch } from "@/interfaces/controller-types";
import { DeleteBranch } from "@/components/modals/branches/deleteBranch";
import { EditBranch } from "@/components/modals/branches/editBranch";

export const RenderCellBranchCompany = ({ branch, columnKey }: {branch: Branch, columnKey: any}) => {

    // @ts-ignore
    const cellValue = branch[columnKey];

    const del = async () => {
        return setTimeout(() => window.location.reload(), 2020)
    }

    switch (columnKey) {
        case "userCount":
            return (
                <div>
                    <span>{branch.User.length} Employee</span>
                </div>
            );

        case "productCount":
            return (
                <div>
                    <span>{branch.Stock.length} Items</span>
                </div>
            );


        case "actions":
            return (
                <div className="flex items-center gap-4 ">
                    <div>
                        <EditBranch {...branch}/>
                    </div>
                    <div>
                        <Tooltip content={"Delete"} color="danger">
                            <DeleteBranch id={branch.id} branchName={branch.name} />
                        </Tooltip>
                    </div>
                </div>
            );
        default:
            return cellValue;
    }
};
