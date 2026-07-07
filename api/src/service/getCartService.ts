import prisma from "../lib/prisma.js";

console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP PASS EXISTS:", Boolean(process.env.SMTP_PASS));

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