import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/libs/auth";
import * as jwt_decode from 'jwt-decode';

export async function middleware(req: NextRequest) {
    const token:any = req.cookies.get('user-token')?.value
    
    const tokenData: any = token === undefined ? undefined : jwt_decode.jwtDecode(token, {header: true})

    // console.log(tokenData.res.role)

    const verifyToken = token && (await verifyAuth(token).catch((err) => {
        console.log(err)
    }))
    
    const { pathname } = req.nextUrl;

    if (!verifyToken && pathname === "/setting") return NextResponse.redirect(new URL('/test/authentication/login', req.url))
    
    if (!verifyToken && pathname === "/test") return NextResponse.redirect(new URL('/test/authentication/login', req.url))
    
    if (!verifyToken && pathname.includes("/test") && !pathname.includes("/authentication")) return NextResponse.redirect(new URL('/test/authentication/login', req.url))
    
    if (!verifyToken && pathname.includes('/admin') && tokenData?.res.role != 'admin' ) return NextResponse.redirect(new URL('/test', req.url))
    
    if (verifyToken && pathname.includes('/admin') && tokenData?.res.role != 'admin' ) return NextResponse.redirect(new URL('/test', req.url))

    if (pathname.startsWith('/test/authentication/login') && !verifyToken) return;

    if (pathname.includes('/test/authentication/login') && verifyToken) return NextResponse.redirect(new URL('/test', req.url))

}

export const config = {
    matcher: ['/', '/setting', '/admin/:path*', '/idol/:path*', "/test/:path*"]
}