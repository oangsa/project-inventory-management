"use client"

import ResetPasswordAction from "@/libs/Actions/ResetPasswordAction";
import { Button, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface PasswordErrorState {
   isUpper: boolean
   isLower: boolean
   isSpecial: boolean
   isNumber: boolean
   isLong: boolean
   isError: boolean
   password: string
}

export default function ResetPassForm(): JSX.Element {
   const toastId = "GAY"

   const [passwordError, setPasswordError] = useState<PasswordErrorState>({isUpper: true, isLower: true, isSpecial: true, isNumber: true, isError: true, isLong: true, password: ""})
   const [password, setPassword] = useState<string>("")
   const [password2, setPassword2] = useState<string>("")

   const passwordValidation = (password: string): void => {
      const specialChars = '@$!%*?&.';
      const upper = /\p{Lu}/u
      const lower = /\p{Ll}/u
      const number = /\d/

      setPasswordError({
         isUpper: upper.test(password) && password != "",
         isLower: lower.test(password) && password != "",
         isSpecial: specialChars.split('').some(char => password.includes(char)) && password != "",
         isNumber: number.test(password) && password != "",
         isLong: password.length >= 8 && password != "",
         isError: !(upper.test(password) && lower.test(password) && specialChars.split('').some(char => password.includes(char)) && number.test(password) && password != ""),
         password: password
      })
   }

   const submit = async(event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      const queryData = new FormData(event.currentTarget);

      toast.loading("Searching User...", {
         id: toastId
      })

      const response = await ResetPasswordAction(queryData)

      if (response?.status != 200) {
         toast.error(response?.message as string, {
            id: toastId
         });
      }

      else if (response?.status == 200) {
         setTimeout(() => window.location.replace(`/authentication/login`), 2021)

         toast.success(response?.message as string, {
            id: toastId
         });
      }
   }

   return (
      <form className="space-y-6 md:space-y-6" onSubmit={submit}>
         <div>
            <label htmlFor="password" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">New Password</label>
            <Input className={`mb-1`} onChange={() => {
               const passwordInput = document.getElementById("password") as HTMLInputElement;
               if (passwordInput) {
                  passwordValidation(passwordInput.value);
                  setPassword(passwordInput.value)
                  console.log(passwordError.isError)
               }
            }} placeholder="••••••••" id="password" name="password" type="password"/>

            <p className={`mb-[2px] text-xs ${passwordError.password != "" ? !passwordError.isLong ? 'text-danger' : 'text-success hidden' : 'dark:text-white text-default'} ml-1`}>• 8 Charactors Long</p>
            <p className={`mb-[2px] text-xs ${passwordError.password != "" ? !passwordError.isLower ? 'text-danger' : 'text-success hidden' : 'dark:text-white text-default'} ml-1`}>• 1 Lowercase</p>
            <p className={`mb-[2px] text-xs ${passwordError.password != "" ? !passwordError.isUpper ? 'text-danger' : 'text-success hidden' : 'dark:text-white text-default'} ml-1`}>• 1 Uppercase</p>
            <p className={`mb-[2px] text-xs ${passwordError.password != "" ? !passwordError.isSpecial ? 'text-danger' : 'text-success hidden' : 'dark:text-white text-default'} ml-1`}>• 1 Special Character</p>
            <p className={`mb-[2px] text-xs ${passwordError.password != "" ? !passwordError.isNumber ? 'text-danger' : 'text-success hidden' : 'dark:text-white text-default'} ml-1`}>• 1 Number</p>
         </div>
         <div>
            {
               passwordError.isError ? password == "" ? "" : "" :
               <>
                  <label htmlFor="password2" className="block mb-2 text-md font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <Input className={`mb-1`} onChange={() => {
                     const passwordInput = document.getElementById("password2") as HTMLInputElement;
                     if (passwordInput) {
                        setPassword2(passwordInput.value)
                     }
                  }} placeholder="••••••••" id="password2" name="password2" type="password"/>
                  <p className={`mb-[2px] text-xs ${password2 != "" ? password == password2 ? 'hidden' : "text-danger" : "hidden"} ml-1`}>Password not match</p>
               </>
            }
         </div>
         <Button isDisabled={!(password == password2 && !passwordError.isError)} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Confirm</Button>
      </form>
   )
}
