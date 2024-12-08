"use client"

import regisHandler from '@/libs/UserHandlers/userRegis';
import { User } from '@/interfaces/controller-types';
import { FormEvent, ReactNode, useState } from 'react';
import { Button, Divider, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';

interface ErrorTest {
   message: string
   isError: boolean
}

export default function RegisterPage(): JSX.Element {
   const [isPressed, setIsPressed] = useState<boolean>(false);
   const [fileError, setFileError] = useState<ErrorTest>({message: "", isError: false})

   const tenMegaBytes = 10000000

   const validateFile = (file: File) => {

      if (file.size > tenMegaBytes) {
         setFileError({message: "File size is too large", isError: true})
         return false
      }
      else if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)) {
         setFileError({message: "File type is not supported", isError: true})
         return false
      }
      else {
         setFileError({message: "", isError: false})
         return true
      }

   }

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

      const picture = data.get("img") as Blob | null;

      if (!picture || !validateFile(picture as File)) {
         setIsPressed(false)
         throw new Error("Please upload a profile picture")
      }

      let pictureUrl = ""

      if ((picture?.size as number) > 0) {
        // change to base64
         const reader = new FileReader();
         reader.readAsDataURL(picture as Blob);
         reader.onloadend = async () => {
            pictureUrl = await reader.result as string;

            const res = await regisHandler(username, password, name, inviteToken, pictureUrl) as Record<string, string | number | User>;

            if (res.status != 200) {
               setIsPressed(false)
               throw new Error(res.message as string)
            }

            setTimeout(() => window.location.replace("/authentication/login"), 3010)

            return res
         };
      }
      else {
         const res = await regisHandler(username, password, name, inviteToken, pictureUrl) as Record<string, string | number | User>;

         if (res.status != 200) {
            setIsPressed(false)
            throw new Error(res.message as string)
         }

         setTimeout(() => window.location.replace("/authentication/login"), 3010)

         return res
      }
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
                              <div>
                                 <label htmlFor="token" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Profile</label>
                                 <Input onChange={() => {
                                    const fileInput = document.getElementById("img") as HTMLInputElement;
                                    if (fileInput && fileInput.files && fileInput.files[0]) {
                                       validateFile(fileInput.files[0]);
                                    }
                                 }} isInvalid={fileError.isError} errorMessage={fileError.message} id="img" name="img" type="file"/>
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
