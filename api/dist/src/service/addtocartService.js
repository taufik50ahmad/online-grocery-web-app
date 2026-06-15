import prisma from "../lib/prisma.js";
export default async function addtoCartService(productId, quantity) {
    const products = await prisma.product.findUnique({
        where: {
            id: productId,
        },
    });
    if (!products) {
        throw new Error("Product not found");
    }
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }
    if (products.quantity < quantity) {
        throw new Error("Product is out of stock");
    }
    const cart = await prisma.cartItem.create({
        data: {
            productId: products.id,
            userId: 1,
            productName: products.name,
            quantity: 1,
            totalPrice: products.price * quantity,
        },
    });
    return cart;
}
//# sourceMappingURL=addtocartService.js.map