import prisma from "../lib/prisma.js";

export async function getCartService(userId: number){
    const cart = await prisma.cartItem.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return cart
}