import * as jwt_decode from 'jwt-decode';
import { User } from "@/interfaces/controller-types";
import getCookies from "./getCookies";
import getUserData from './getUserData';

export default async function getDataByCookie(): Promise<Record<string, string | number | User>> {
    const cookie: any = await getCookies();
    
    if (cookie?.status != undefined) return {"status": 401, "message": "Unauthorize!"};
    
    const token: any = jwt_decode.jwtDecode(cookie, {header: true});
    const user = await getUserData(token);
    
    return {"status": 200, "message": "Success", "user": user};
}