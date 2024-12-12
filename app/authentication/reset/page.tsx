"use client"

import { User } from '@/interfaces/controller-types';
import { useActionState, useEffect, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import toast from 'react-hot-toast';
import findUserForResetPassword from '@/libs/Actions/FindUser';

export default function ResetPassPage(): JSX.Element {
   const [isPressed, setIsPressed] = useState<boolean>(false);
   const [response, formAction, isPending] = useActionState(findUserForResetPassword, null);

   const [toastId, setToastId] = useState<string>("GAY");

   const redirect  = () => window.location.replace(`/authentication/reset/${(response?.user as User).id}`)

   const submit = async(queryData: FormData): Promise<void> => {
      await formAction(queryData)

      toast.loading('Searching User...', {
         id: toastId
      })

   }

   useEffect(() => {
      if (!response) {
         return;
      }

      if (response?.status != 200) {
         toast.error(response?.message as string, {
            id: toastId
         });
      }

      else if (response?.status == 200) {
         setTimeout(() => redirect(), 2021)
         toast.success(response?.message as string, {
            id: toastId
         });
      }
   }, [isPending, response, toastId]);

   return (
      <>
         <div>
            <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
               <div className="w-full bg-white rounded-lg shadow dark:bg-default/60 max-w-md p-0 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                     <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
                        Reset Password
                     </h1>
                     <form className="space-y-6 md:space-y-6" action={submit}>
                        <div>
                           <label htmlFor="username" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Username</label>
                           <Input placeholder="username" id="username" name="username" type="text"/>
                        </div>
                        <Button isLoading={isPressed} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Continue</Button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}
