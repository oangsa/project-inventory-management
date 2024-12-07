import { deleteCookie } from "cookies-next";

export async function logoutHandler(): Promise<Record<string, string | number>> {
    deleteCookie("user-token")

    return {"status": 200, "message": "Successfully logged out."}
}
