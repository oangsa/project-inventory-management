"use client"

import getToken from '@/libs/token';
import loginHandler from '@/libs/UserHandlers/userLogin';
import { User } from '@/interfaces/controller-types';
import { setCookie } from 'cookies-next';
import { FormEvent, ReactNode, useActionState, useState } from 'react';
import { Button, Checkbox, Divider, Input, Link } from '@nextui-org/react';
import { EyeSlashFilledIcon } from '@/components/icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '@/components/icons/EyeFilledIcon';
import toast, { Toaster } from 'react-hot-toast';
import Form from 'next/form'
import { useFormStatus } from 'react-dom';

export default function page(): JSX.Element {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const [isSelected, setIsSelected] = useState<boolean>(false);
    const {data, pending} = useFormStatus()

    const togglePasswordVisibility = () => setIsVisible(!isVisible);
    
    const toggleIsPressed = () => setIsPressed(!isPressed);

    const thirtydays = 30 * 24 * 60 * 60 * 1000

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
        
        const data = new FormData(event.currentTarget)
        const username = data.get("username") as string;
        const password = data.get("password") as string;

        const res = await loginHandler(username, password) as Record<string, string | number | User>;
        
        if (res.status != 200) {
            throw new Error(res.message as string)
        }
    
        const token = await getToken(res.user as User)
    
        setCookie('user-token', token, { maxAge: thirtydays })

        setTimeout(() => window.location.reload(), 3010)
        
        return res
    
    }

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
                    <div className="w-full bg-white rounded-lg shadow dark:border max-w-md p-0 dark:bg-gray-800 dark:border-gray-700">
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
                                <Button isDisabled={pending} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</Button>
                                <Toaster position="top-right"/>
                            </form>
                            <Divider className='m-1'/>
                            <div className="flex items-center justify-center gap-2">
                                <p className='text-sm font-medium'>New user?</p>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </>
    )
}
