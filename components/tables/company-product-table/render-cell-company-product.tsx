import { EditProduct } from "@/components/modals/products/editProduct";
import { Tooltip } from "@nextui-org/react";
import React from "react";
import ReactTimeAgo from 'react-time-ago'

//Icons
import { Product } from "@/interfaces/controller-types";
import { DeleteProduct } from "@/components/modals/products/deleteProduct";

export const RenderCellProductCompany = ({ product, columnKey }: {product: Product, columnKey: any}) => {

    // @ts-ignore
    const cellValue = product[columnKey];

    const del = async () => {
        // confirmDelete(product.studentId)
        return setTimeout(() => window.location.reload(), 2020)
    }

    switch (columnKey) {
        case "branch":
            return (
                <div>
                    <span>{product.useInBranch.name}</span>
                </div>
            );

        case "price":
            return (
                <div>
                    <span>{product.price} THB</span>
                </div>
            );

        case "last_edit":
            return (
                <div>
                    <span>{product.latestEdit.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }).replace(/(.*)\D\d+/, '$1')}  (<ReactTimeAgo className="text-red-500" date={product.latestEdit.getTime()} locale="en-US"/>)</span>
                </div>
            );

        case "last_restock":
            return (
                <div>
                    <span>{product.latestRefill.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }).replace(/(.*)\D\d+/, '$1')}</span>
                </div>
            );

        case "actions":
            return (
                <div className="flex items-center gap-4 ">
                    <div>
                        <EditProduct {...product}/>
                    </div>
                    <div>
                        <Tooltip content={"Delete"} color="danger">
                            <DeleteProduct id={product.id} name = {product.name} branchName={product.useInBranch.name} />
                        </Tooltip>
                    </div>
                </div>
            );
        default:
            return cellValue;
    }
};
