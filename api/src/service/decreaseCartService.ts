import prisma from "../lib/prisma.js"

export default async function decreaseCartService(id: number){
    const cartItem = await prisma.cartItem.findUnique({
        where:{
            id
        },
        include:{
            product: true
        }
    })

    if(!cartItem){
        throw new Error("Cart item not found")
    }

    if(cartItem.quantity > 1){
        const newQuantity = cartItem.quantity -1
        const decreaseCart = await prisma.cartItem.update({
            where:{
                id
            },
            data:{
                quantity: newQuantity,
                totalPrice: cartItem.product.price * newQuantity
            }
        })

        return decreaseCart
    }
}