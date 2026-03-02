
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string[];
  shopId: string;
  shopName: string;
  stock: number;
  isActive: boolean;
}
