import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Signal privé pour les données
  private cart = signal<CartItem[]>([]);

  // Sécurisation de l'accès aux données
  cartItems = this.cart.asReadonly();
  
  // Calculs automatiques via Computed
  cartTotal = computed(() =>
    this.cart().reduce((total, item) => total + (item.price * item.quantity), 0)
  );
  
  itemCount = computed(() =>
    this.cart().reduce((count, item) => count + item.quantity, 0)
  );

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) this.cart.set(JSON.parse(savedCart));
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }

  addToCart(item: CartItem) {
    this.cart.update(cart => {
      const existing = cart.find(i => i.productId === item.productId);
      if (existing) {
        return cart.map(i => i.productId === item.productId 
          ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...cart, item];
    });
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cart.update(cart =>
      cart.map(item => item.productId === productId ? { ...item, quantity } : item)
    );
    this.saveCart();
  }

  removeFromCart(productId: string) {
    this.cart.update(cart => cart.filter(item => item.productId !== productId));
    this.saveCart();
  }

  clearCart() {
    this.cart.set([]);
    localStorage.removeItem('cart');
  }
}