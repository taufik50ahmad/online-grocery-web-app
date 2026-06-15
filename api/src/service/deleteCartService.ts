import prisma from "../lib/prisma.js";

export default async function deleteCartService(id: number) {
    const cartItem = await prisma.cartItem.findUnique({
        where: {
            id
        },
        include: {
            product: true
        }
    })
    
    if(!cartItem){
        throw new Error("Cart item not found")
    }

    if(cartItem.quantity === 1){
        const deletedCart = await prisma.cartItem.delete({
            where:{
                id
            }
        })

        return deletedCart
    }
}