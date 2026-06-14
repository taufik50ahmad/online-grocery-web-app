import prisma from "../lib/prisma.js";

export default async function addtoCartService(productId: number, quantity: number, userId: number){
        const products = await prisma.product.findUnique({
            where:{
                id: productId,
            },
        })

        if (!products){
            throw new Error("Product not found")
        }

        if (quantity <= 0){
            throw new Error("Quantity must be greater than 0")
        }

        if(products.quantity < quantity){
            throw new Error("Product is out of stock")
        }

        const existingCart = await prisma.cartItem.findFirst({
            where: {
                productId: products.id,
                userId: userId
            }
        })

        if(existingCart){
            return await prisma.cartItem.update({
                where: {id: existingCart.id},
                data: {
                    quantity: {
                        increment: 1
                    }
                }
            })
        }

        const cart = await prisma.cartItem.create({
            data: {
                productId: products.id,
                userId: 1,
                productName: products.name,
                quantity: 1,
                totalPrice: products.price * quantity,
            },
        })

        return cart
}