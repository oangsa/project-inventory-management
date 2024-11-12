'use client'
import updateUserHandler from '@/libs/UserHandlers/updateUser';
import loginHandler from '@/libs/UserHandlers/userLogin'
import { InviteCode, User, Product } from '../../interfaces/controller-types';
import React from 'react'
import { redirect } from 'next/navigation'
import getToken from '@/libs/token';
import { setCookie } from 'cookies-next';
import createInviteCode from '@/libs/UserHandlers/createInviteCode';
import getDataByCookie from '@/libs/getUserByCookie';
import regisHandler from '@/libs/UserHandlers/userRegis';
import productCreate from '@/libs/ProductHandler/productCreate';
import branchCreate from '@/libs/CompanyHandler/createBranch';
import companyCreate from '@/libs/CompanyHandler/createCompany';

export default function page(): JSX.Element {
  const thirtydays = 30 * 24 * 60 * 60 * 1000

  const prod = {
    name: "Leo",
    price: 35,
    remain: 20,
  } as Product

  const isFirstCreate: boolean = true
  
  async function logInTest() {
    const res = await loginHandler("martin", "cpe123") as Record<string, string | number | User>;
    
    if (res.status != 200) return alert(res.message);

    const token = await getToken(res.user as User)

    setCookie('user-token', token, { maxAge: thirtydays })

    // redirect("/test/loggedIn")

  }

  async function createInviteCodeTest() {
    const data = await getDataByCookie();

    if(data.status != 200) return alert(data.message);

    const res = await createInviteCode("employee", data.user as User)
    
    if (res.status != 200) return alert(res.message);

    alert((res.token as InviteCode).code)
  }

  async function registerTest() {
    const res = await regisHandler("martin", "cpe123", "Martin", "whmitfkz9k");

    if(res.status != 200) return alert(res.message);

    return alert(res.message)
  }

  async function createProductTest() {
    const data = await getDataByCookie();

    if(data.status != 200) return alert(data.message);

    const res = await productCreate(prod, data.user as User);

    return alert(res.message)
  }

  async function createCompany() {
    const res = await companyCreate("CPE", "I_LOVE_THE_PERSON_WHOSE_NAME_START_WITH_");
    
    return alert(res.message)
  }

  async function createNewBranch() {
    const data = await getDataByCookie();

    if(data.status != 200) return alert(data.message);

    const res = await branchCreate("Bangmod", "discord", "", 15, (data.user as User).company, data.user as User, false)
    
    return alert(res.message)
    
  }

  return (
    <>
      <button onClick={logInTest} className='m-2 p-1.5 rounded-md bg-sky-300 font-normal font-white'>Login Test</button>
      <br />
      <button onClick={createInviteCodeTest} className='m-2 p-1.5 rounded-md bg-slate-300 font-normal font-white'>Create Code Test</button>
      <br />
      <button onClick={registerTest} className='m-2 p-1.5 rounded-md bg-yellow-300 font-normal font-white'>Register Test</button>
      <br />
      <button onClick={createProductTest} className='m-2 p-1.5 rounded-md bg-purple-300 font-normal font-white'>Create Product</button>
      <br />
      <button onClick={createCompany} className='m-2 p-1.5 rounded-md bg-zinc-300 font-normal font-white'>Create Company</button>
      <br />
      <button onClick={createNewBranch} className='m-2 p-1.5 rounded-md bg-orange-300 font-normal font-white'>Create Branch</button>
    </>
  )
}
