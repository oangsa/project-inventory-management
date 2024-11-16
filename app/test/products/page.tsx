'use client'

import { Product, User } from '@/interfaces/controller-types'
import getDataByCookie from '@/libs/getUserByCookie'
import { deleteProduct } from '@/libs/ProductHandler/productDelete'
import getProducts from '@/libs/ProductHandler/productGets'
import { useEffect, useState } from 'react'
import { BsTrash3Fill } from "react-icons/bs";

export default function ProductList(): JSX.Element {
    const [data, setData] = useState<Product[]>([])
    
    useEffect(() => {
        async function fetchProducts() {
          let user = await getDataByCookie();
          let res = await getProducts(user.user as User)

          setData(res)
        }
        fetchProducts()
    }, [])

    async function del(prod: Product) {
        const res = await deleteProduct(prod.id);

        return alert(res.message)
    }

    if (!data.length) return <div>Loading...</div>

    return (
        <div className='m-6'>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Remain</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Last Edit</th>
                        <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((product: Product) => (
                        <tr key={product.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.name}</th>
                            <td className='px-6 py-4'>{product.remain}</td>
                            <td className='px-6 py-4'>{product.price}</td>
                            <td className='px-6 py-4'>{product.latestEdit.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</td>
                            <td className='px-6 py-4'><button onClick={() => del(product)}><BsTrash3Fill></BsTrash3Fill></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}