import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyAuthAndGetData } from "@/libs/auth";
import ResetPassForm from "@/components/etc/ResetPassForm";
import { redirect } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ slug: string }>}): Promise<JSX.Element> {
   const slug = (await params).slug
   const cookieStore = await cookies();
   const cookie = cookieStore.get('resetToken')?.value;

   const toastId = "GAY"

   const verifyToken = cookie && (await verifyAuthAndGetData(cookie).catch((err) => {
      console.log(err)
   }))

   if (!slug || !cookie || !verifyToken || (verifyToken.user as User).id != slug) {
      return (
         <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
            <div className="w-full bg-white rounded-lg shadow dark:bg-default/60 max-w-md p-0 dark:border-gray-700">
               <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
                     Invalid Password Reset Token
                  </h1>
                  <form action={async () => {
                     "use server"
                     redirect("/authentication/login")
                  }}>
                     <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Go Back</button>
                  </form>
               </div>
            </div>
         </div>
      )
   }

   return (
      <>
         <div>
            <div className="flex flex-col items-center justify-center px-16 py-8 mx-auto h-screen">
               <div className="w-full bg-white rounded-lg shadow dark:bg-default/60 max-w-md p-0 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                     <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 text-2xl dark:text-white">
                        Reset Password
                     </h1>
                     <ResetPassForm/>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}
