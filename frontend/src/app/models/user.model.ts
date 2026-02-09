export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'shop' | 'admin';
  phone?: string;
  address?: string;
  shopName?: string;
  category?: string;
  location?: string;
}

// src/app/models/product.model.ts
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

// src/app/models/order.model.ts
export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  shopId: string;
  shopName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalPrice: number;
  paymentMethod: 'mvola' | 'airtel' | 'orange' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// src/app/models/cart.model.ts
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shopId: string;
  shopName: string;
}

// src/app/models/shop.model.ts
export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  category: string;
  location: string;
  description: string;
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
}
