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