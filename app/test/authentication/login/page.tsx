'use client'

import getToken from '@/libs/token';
import loginHandler from '@/libs/UserHandlers/userLogin';
import { User } from '@/interfaces/controller-types';
import { setCookie } from 'cookies-next';
import React from 'react'

export default function page() {
    const thirtydays = 30 * 24 * 60 * 60 * 1000

    async function logInTest() {
        const res = await loginHandler("WAWAadmin", "WAWAadmin") as Record<string, string | number | User>;
        
        if (res.status != 200) return alert(res.message);
    
        const token = await getToken(res.user as User)
    
        setCookie('user-token', token, { maxAge: thirtydays })
    
        // redirect("/test/loggedIn")
    
    }

    return (
        <>
            <button onClick={logInTest} className='m-2 p-1.5 rounded-md bg-sky-300 font-normal font-white'>Login Test</button>
            <br />
        </>
    )
}
