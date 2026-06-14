import prisma from "../lib/prisma.js";

export async function getCartService(userId: number){
    const cart = await prisma.cartItem.findMany({
        where: {
            userId: userId,
        }
    })

    return cart
}