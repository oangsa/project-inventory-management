"use client"

import getToken from '@/libs/token';
import loginHandler from '@/libs/UserHandlers/userLogin';
import { User } from '@/interfaces/controller-types';
import { setCookie } from 'cookies-next';
import Cookies from 'js-cookie';
import { FormEvent, ReactNode, useState } from 'react';
import { Button, Checkbox, Divider, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';

export default function LoginPage(): JSX.Element {
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const thirtydays = 30

    const notify = async (data: FormEvent<HTMLFormElement>) => toast.promise(
        logInTest(data),
        {
            loading: 'Loging In...',
            success: (data) => {
                return <b>{data?.message as ReactNode}</b>
            },
            error: (e) => <b>{e.message}</b>,
        },
        {
            loading: {
                duration: 3000
            }
        }
    )

    async function logInTest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsPressed(true)

        const data = new FormData(event.currentTarget)

        const username = data.get("username") as string;
        const password = data.get("password") as string;

        const res = await loginHandler(username, password) as Record<string, string | number | User>;

        if (res.status != 200) {
            setIsPressed(false)
            throw new Error(res.message as string)
        }

        setTimeout(() => window.location.reload(), 4010)

        return res

    }

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
                    <div className="w-full bg-white rounded-lg shadow dark:bg-default/60 max-w-md p-0 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
                                Login 🔒
                            </h1>
                            <form className="space-y-6 md:space-y-6" onSubmit={notify}>
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
                                    <a href="#" className="sm:mt-2 text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                </div>
                                <Button isLoading={isPressed} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</Button>
                            </form>
                            <Divider className='m-1'/>
                            <div className="flex items-center justify-center gap-2">
                                <p className='text-sm font-medium'>Want to create a new company account?</p>
                                <a href="/authentication/company/registeration" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Create</a>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <p className='text-sm font-medium'>New user?</p>
                                <a href="/authentication/registeration" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
