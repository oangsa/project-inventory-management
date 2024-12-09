"use client"

import getToken from '@/libs/token';
import regisHandler from '@/libs/UserHandlers/userRegis';
import { User } from '@/interfaces/controller-types';
import { setCookie } from 'cookies-next';
import { FormEvent, ReactNode, useState } from 'react';
import { Button, Checkbox, Divider, Input, Link } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { useFormStatus } from 'react-dom';

export default function RegisterPage(): JSX.Element {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const {data, pending} = useFormStatus()

    const thirtydays = 30 * 24 * 60 * 60 * 1000

    const notify = async (data: FormEvent<HTMLFormElement>) => toast.promise(
        register(data),
        {
            loading: 'Creating...',
            success: (data) => {
                return <b>{data?.message as ReactNode}</b>
            },
            error: (e) => {
               setIsPressed(false)
               return <b>{e.message}</b>},
        },
        {
            loading: {
                duration: 3000
            }
        }
    )

    async function register(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPressed(true)

        const data = new FormData(event.currentTarget)
        const username = data.get("username") as string;
        const password = data.get("password") as string;
        const name = data.get("name") as string;
        const inviteToken = data.get("token") as string;

        const res = await regisHandler(username, password, name, inviteToken) as Record<string, string | number | User>;

        if (res.status != 200) {
            setIsPressed(false)
            throw new Error(res.message as string)
        }

        setTimeout(() => window.location.replace("/authentication/login"), 3010)

        return res

    }

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
                    <div className="w-full bg-white rounded-lg shadow dark:border max-w-md p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
                                Create Account
                            </h1>
                            <form className="space-y-6 md:space-y-6" onSubmit={notify}>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Name</label>
                                    <Input placeholder="name" id="name" name="name" type="text" required/>
                                </div>
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Username</label>
                                    <Input placeholder="username" id="username" name="username" type="text" required/>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Password</label>
                                    <Input  placeholder="••••••••" id="password" name="password" type="password" required/>
                                </div>
                                <div>
                                    <label htmlFor="token" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Token</label>
                                    <Input  placeholder="token" id="token" name="token" type="text" required/>
                                </div>
                                <div className="xl:flex md:flex items-center md:justify-between xl:justify-between">

                                </div>
                                <Button isLoading={isPressed} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign up</Button>
                            </form>
                            <Divider className='m-1'/>
                            <div className="xl:flex md:grid sm:grid items-center justify-center gap-2">
                                <p className='text-sm font-medium'>Want to create a new company account?</p>
                                <a href="/authentication/company/registeration" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Create</a>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <p className='text-sm font-medium'>Already have an account?</p>
                                <a href="/authentication/login" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
