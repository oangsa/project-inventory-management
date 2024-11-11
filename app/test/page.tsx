'use client'
import updateUserHandler from '@/libs/Handlers/updateUser';
import loginHandler from '@/libs/Handlers/userLogin'
import React from 'react'

export default function page(): JSX.Element {
  
  async function btnClick() {
    const a = loginHandler("CPE_Admin", "CPE3822");
  }

  return (
    <>
      <button onClick={btnClick} className='p-1.5 rounded-md bg-sky-300 font-normal font-white'>Login Test</button>
    </>
  )
}
