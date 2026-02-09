import { Injectable, signal } from '@angular/core';
import { DEMO_PRODUCTS } from '../data/demo-data';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Utiliser un signal pour les produits
  private products = signal<Product[]>(DEMO_PRODUCTS);

  // Exposer un signal en lecture seule
  productsSig = this.products.asReadonly();

  constructor() {}

  // Retourner directement le tableau (pas un signal)
  getAllProducts(): Product[] {
    return this.products();
  }

  getProductsByShop(shopId: string): Product[] {
    return this.products().filter(p => p.shopId === shopId);
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  searchProducts(query: string, category?: string): Product[] {
    let results = this.products();

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.some(c => c.toLowerCase().includes(q))
      );
    }

    if (category) {
      results = results.filter(p =>
        p.category.includes(category)
      );
    }

    return results;
  }

  addProduct(productData: Omit<Product, 'id'>): void {
    const newProduct: Product = {
      ...productData,
      id: 'p' + (this.products().length + 1)
    };

    this.products.update(products => [...products, newProduct]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }

  deleteProduct(id: string): void {
    this.products.update(products =>
      products.filter(p => p.id !== id)
    );
  }
}
