import { DeleteProduct } from "@/components/modals/deleteProduct";
import { EditProduct } from "@/components/modals/editProduct";
import { Tooltip } from "@nextui-org/react";
import React from "react";

//Icons
import ReactTimeAgo from "react-time-ago";

export const RenderCell = ({ product, columnKey }: any) => {
  // @ts-ignore
  const cellValue = product[columnKey];

  switch (columnKey) {

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