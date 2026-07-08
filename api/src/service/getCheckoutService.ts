import prisma from "../lib/prisma.js";

export default async function getCheckoutService(){
    const checkoutItem = await prisma.orderItem.findMany({
        select:{
            productName:true,
            quantity:true,
            totalPrice:true
        }
    })

    if(checkoutItem.length === 0){
        throw new Error("Checkout Item Not Found")
    }
    
    return checkoutItem
}