'use client'
import updateUserHandler from '@/libs/Handlers/updateUser';
import loginHandler from '@/libs/Handlers/userLogin'
import { InviteCode, User } from '../../interfaces/controller-types';
import React from 'react'
import { redirect } from 'next/navigation'
import getToken from '@/libs/token';
import { setCookie } from 'cookies-next';
import createInviteCode from '@/libs/Handlers/createInviteCode';
import getDataByCookie from '@/libs/getUserByCookie';
import regisHandler from '@/libs/Handlers/userRegis';

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
    const data = await getDataByCookie();

    if(data.status != 200) return alert(data.message);

    const res = await createInviteCode("manager", data.user as User)
    
    if (res.status != 200) return alert(res.message);

    alert((res.token as InviteCode).code)
  }

  async function registerTest() {
    const res = await regisHandler("oangsa", "cpe123", "suthang sukrueangkun", "u49lkdpvp1");

    if(res.status != 200) return alert(res.message);

    alert(res.message)
  }

  return (
    <>
      <button onClick={logInTest} className='m-2 p-1.5 rounded-md bg-sky-300 font-normal font-white'>Login Test</button>
      <br />
      <button onClick={createInviteCodeTest} className='m-2 p-1.5 rounded-md bg-slate-300 font-normal font-white'>Create Code Test</button>
      <br />
      <button onClick={registerTest} className='m-2 p-1.5 rounded-md bg-yellow-300 font-normal font-white'>Register Test</button>
    </>
  )
}
