import { getCookie } from "cookies-next";

export default function hasCookie(name: string) {
    return getCookie(name) == undefined ? false : true
}