import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/libs/auth";
import * as jwt_decode from 'jwt-decode';

export async function middleware(req: NextRequest) {
    const token:any = req.cookies.get('user-token')?.value
    
    const tokenData: any = token === undefined ? undefined : jwt_decode.jwtDecode(token, {header: true})

    const verifyToken = token && (await verifyAuth(token).catch((err) => {
        console.log(err)
    }))
    
    const { pathname } = req.nextUrl;

    if (!verifyToken && pathname === "/setting") return NextResponse.redirect(new URL('/authentication/login', req.url))
    
    if (!verifyToken && pathname === "/test") return NextResponse.redirect(new URL('/authentication/login', req.url))
    
    if (!verifyToken && pathname.includes("/test") && !pathname.includes("/authentication")) return NextResponse.redirect(new URL('/authentication/login', req.url))
    
    if (!verifyToken && pathname.includes('/admin') && tokenData?.res.role != 'admin' ) return NextResponse.redirect(new URL('/test', req.url))
    
    if (verifyToken && pathname.includes('/test/products') && tokenData?.res.role == 'admin' ) return NextResponse.redirect(new URL('/test/admin/products', req.url))
    
    if (verifyToken && pathname.includes('/admin') && tokenData?.res.role != 'admin' ) return NextResponse.redirect(new URL('/test', req.url))

    if (pathname.startsWith('/authentication/login') && !verifyToken) return;

    if (pathname.includes('/authentication/login') && verifyToken) return NextResponse.redirect(new URL('/test/products?page=1', req.url))

}

export const config = {
    matcher: ['/', '/setting', '/admin/:path*', '/idol/:path*', "/test/:path*", "/authentication/:path*"]
}