

export interface Order {
  _id: string;
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

