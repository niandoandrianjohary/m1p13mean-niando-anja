
export interface Product {
  id: string;
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
