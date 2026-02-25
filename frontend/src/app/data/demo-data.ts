import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Shop } from '../models/shop.model';
import { User } from '../models/user.model';


export const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@ivandry.mg',
    password: 'admin123',
    name: 'Admin Ivandry',
    role: 'admin',
    phone: '034 00 000 00'
  },
  {
    id: '2',
    email: 'zara@ivandry.mg',
    password: 'zara123',
    name: 'Manager Zara',
    role: 'shop',
    shopName: 'Zara Ivandry',
    category: 'fashion',
    location: 'Aile Nord',
    phone: '034 20 000 00'
  },
  {
    id: '3',
    email: 'client@example.mg',
    password: 'client123',
    name: 'Jean Dupont',
    role: 'buyer',
    phone: '034 12 345 67',
    address: 'Ivandry, Antananarivo'
  }
];

export const DEMO_SHOPS: Shop[] = [
  {
    _id: '6992cdf5448a4a1063676fa3',
    name: 'ASA',
    ownerId: {
      _id: '6992cdf5448a4a1063676fa1',
      email: 'niando.andraina.andrianjohary@gmail.com',
      name: 'a',
      phone: 'q'
    },
    category: 'fashion',
    location: 'Non précisée',
    description: 'AS',
    status: 'pending',
    createdAt: new Date('2026-02-16T07:57:41.215Z')
  }
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Chemise Blanche Homme',
    description: 'Chemise en coton premium',
    price: 45000,
    image: 'https://via.placeholder.com/300x400/1a237e/ffffff?text=Chemise+Zara',
    category: ['fashion', 'homme', 'chemise'],
    shopId: 's1',
    shopName: 'Zara Ivandry',
    stock: 50,
    isActive: true
  },
  {
    id: 'p2',
    name: 'Jean Slim Noir',
    description: 'Jean moderne couleur noir',
    price: 85000,
    image: 'https://via.placeholder.com/300x400/2e7d32/ffffff?text=Jean+LC',
    category: ['fashion', 'homme', 'pantalon'],
    shopId: 's2',
    shopName: 'LC Waikiki',
    stock: 30,
    isActive: true
  },
  {
    id: 'p3',
    name: 'Smartphone Android',
    description: 'Smartphone dernier cri',
    price: 450000,
    image: 'https://via.placeholder.com/300x400/0288d1/ffffff?text=Smartphone',
    category: ['electronics', 'téléphone'],
    shopId: 's3',
    shopName: 'Star',
    stock: 15,
    isActive: true
  },
  {
    id: 'p4',
    name: 'T-shirt Décontracté',
    description: 'T-shirt coton pour usage quotidien',
    price: 25000,
    image: 'https://via.placeholder.com/300x400/f57c00/ffffff?text=T-shirt',
    category: ['fashion', 'homme', 't-shirt'],
    shopId: 's1',
    shopName: 'Zara Ivandry',
    stock: 100,
    isActive: true
  },
  {
    id: 'p5',
    name: 'Robes Été',
    description: 'Robe légère pour été',
    price: 65000,
    image: 'https://via.placeholder.com/300x400/d32f2f/ffffff?text=Robe',
    category: ['fashion', 'femme', 'robe'],
    shopId: 's2',
    shopName: 'LC Waikiki',
    stock: 25,
    isActive: true
  },
  {
    id: 'p6',
    name: 'Écouteurs Bluetooth',
    description: 'Écouteurs sans fil',
    price: 75000,
    image: 'https://via.placeholder.com/300x400/7b1fa2/ffffff?text=Écouteurs',
    category: ['electronics', 'audio'],
    shopId: 's3',
    shopName: 'Star',
    stock: 40,
    isActive: true
  }
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'o1',
    buyerId: '3',
    buyerName: 'Jean Dupont',
    shopId: 's1',
    shopName: 'Zara Ivandry',
    items: [
      {
        productId: 'p1',
        name: 'Chemise Blanche Homme',
        price: 45000,
        quantity: 2,
        image: 'https://via.placeholder.com/300x400/1a237e/ffffff?text=Chemise'
      }
    ],
    status: 'delivered',
    totalPrice: 90000,
    paymentMethod: 'mvola',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'o2',
    buyerId: '3',
    buyerName: 'Jean Dupont',
    shopId: 's2',
    shopName: 'LC Waikiki',
    items: [
      {
        productId: 'p2',
        name: 'Jean Slim Noir',
        price: 85000,
        quantity: 1,
        image: 'https://via.placeholder.com/300x400/2e7d32/ffffff?text=Jean'
      }
    ],
    status: 'preparing',
    totalPrice: 85000,
    paymentMethod: 'airtel',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
];
