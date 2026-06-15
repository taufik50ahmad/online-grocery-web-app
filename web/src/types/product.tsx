export type Product = {
  id: number;
  storeId: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock: number;
  discountLabel?: string;
  image: string;
};