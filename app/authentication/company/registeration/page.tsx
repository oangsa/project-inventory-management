"use client"

import { User } from '@/interfaces/controller-types';
import { FormEvent, ReactNode, useState } from 'react';
import { Button, Checkbox, Divider, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useFormStatus } from 'react-dom';
import companyCreate from '@/libs/CompanyHandler/createCompany';
import { useRouter } from 'next/navigation';

export default function CompanyRegisterPage(): JSX.Element {
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const {data, pending} = useFormStatus()
    const router = useRouter()

    const notify = async (data: FormEvent<HTMLFormElement>) => toast.promise(
        regisCompany(data),
        {
            loading: 'Creating...',
            success: (data) => {
                return <b>{data?.message as ReactNode}</b>
            },
            error: (e) => <b>{e.message}</b>,
        },
        {
            loading: {
                duration: 2000
            },

            success: {
                duration: 5000,
            }
        }
    )
    async function regisCompany(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget)

        const companyName = data.get("companyName") as string
        const username = data.get("username") as string;
        const password = data.get("password") as string;

        const res = await companyCreate(companyName, username, password) as Record<string, string | number | User>;

        if (res.status != 200) {
            throw new Error(res.message as string)
        }

        setTimeout(() => router.push("/authentication/login"), 6060)

        return res

    }

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
                    <div className="w-full bg-white rounded-lg shadow dark:bg-default/60 max-w-md p-0 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
                                Create Company
                            </h1>
                            <form className="space-y-6 md:space-y-6" onSubmit={notify}>
                                <div>
                                    <label htmlFor="companyName" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Company name</label>
                                    <Input placeholder="company name" id="companyName" name="companyName" type="text" required/>
                                </div>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Username</label>
                                    <Input placeholder="username" id="username" name="username" type="text" required/>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Password</label>
                                    <Input  placeholder="••••••••" id="password" name="password" type="password" required/>
                                </div>
                                <div className="xl:flex md:flex items-center md:justify-between xl:justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <Checkbox className='text-xs' id="remember" type="checkbox" isSelected={isSelected} onValueChange={setIsSelected}>Remember me</Checkbox>
                                        </div>
                                    </div>
                                </div>
                                <Button isDisabled={pending} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create</Button>
                                <Divider className='m-1'/>
                                <div className="flex items-center justify-center gap-2">
                                    <p className='text-sm font-medium'>Already have an account?</p>
                                    <a href="/authentication/login" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
