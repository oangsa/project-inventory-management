'use client'
import updateUserHandler from '@/libs/Handlers/updateUser';
import loginHandler from '@/libs/Handlers/userLogin'
import { User } from '../../interfaces/controller-types';
import React from 'react'
import { redirect } from 'next/navigation'
import getToken from '@/libs/token';
import { setCookie } from 'cookies-next';

export default function page(): JSX.Element {
  const thirtydays = 30 * 24 * 60 * 60 * 1000
  
  async function logInTest() {
    const res = await loginHandler("CPE_Admin", "CPE38") as Record<string, string | number | User>;
    
    if (res.status != 200) return alert(res.message);

    const token = await getToken(res.user as User)

    setCookie('user-token', token, { maxAge: thirtydays })

    // redirect("/test/loggedIn")

  }

  async function createInviteCodeTest() {

  }

  return (
    <>
      <button onClick={logInTest} className='m-2 p-1.5 rounded-md bg-sky-300 font-normal font-white'>Login Test</button>
      <br />
      <button onClick={createInviteCodeTest} className='m-2 p-1.5 rounded-md bg-slate-300 font-normal font-white'>Create Code Test</button>
    </>
  )
}
