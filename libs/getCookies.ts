import { getCookie } from "cookies-next";

export default async function getCookies() {
    const cookie: any = await getCookie('user-token');

    // console.log(cookie)
    
    if (cookie === undefined) return {"status": 401, "message": "Unauthorize!"};
    
    return cookie;
}