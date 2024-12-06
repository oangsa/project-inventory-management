import prisma from '@/libs/prismadb';

export default async function userDeleteHandler(userId: string): Promise<Record<string, number | string>> {
    const checkUser = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!checkUser) return {"status": 404, "message": "User not found."}

    const del_user = await prisma.user.delete({
        where: {
            id: userId
        }
    })

    return {"status": 200, "message": `'${del_user.username}' has been deleted!`}
}
