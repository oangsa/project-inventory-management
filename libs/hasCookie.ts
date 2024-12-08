import { getCookie } from "cookies-next";

export default function hasCookie(name: string) {
    // Just checking if cookie is exist or not.
    return getCookie(name) == undefined ? false : true
}
