import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/libs/auth";
import * as jwt_decode from 'jwt-decode';

export async function middleware(req: NextRequest) {
    const token: any = req.cookies.get('user-token')?.value

    const tokenData: any = token === undefined ? undefined : jwt_decode.jwtDecode(token, {header: true})

    const verifyToken = token && (await verifyAuth(token).catch((err) => {
        console.log(err)
    }))

    const { pathname } = req.nextUrl;

    if (!verifyToken && !pathname.includes("/authentication")) return NextResponse.redirect(new URL('/authentication/login', req.url))

    if (verifyToken && pathname.startsWith('/products') && tokenData?.res.role == 'admin' ) return NextResponse.redirect(new URL('/admin/products', req.url))

    if (verifyToken && pathname.includes('/admin') && tokenData?.res.role != 'admin' ) return NextResponse.redirect(new URL('/products', req.url))

    if (pathname.startsWith('/authentication') && !verifyToken) return;

    if (pathname.startsWith('/authentication') && verifyToken) return NextResponse.redirect(new URL('/products?page=1', req.url))

}

export const config = {
    matcher: ['/', '/products', '/admin/:path*', "/authentication/:path*", "/manager/:path*"],
}
