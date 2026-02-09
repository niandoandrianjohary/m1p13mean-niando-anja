import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-dark text-white vh-100 p-0">
          <div class="p-4">
            <h4 class="text-center mb-4">Acheteur</h4>
            <nav class="nav flex-column">
              <a class="nav-link text-white" routerLink="/buyer">
                <i class="fas fa-home me-2"></i>Accueil
              </a>
              <a class="nav-link text-white" (click)="showProducts = true; showCart = false">
                <i class="fas fa-shopping-bag me-2"></i>Produits
              </a>
              <a class="nav-link text-white" (click)="showCart = true; showProducts = false">
                <i class="fas fa-shopping-cart me-2"></i>
                Panier <span class="badge bg-primary">{{ cartService.itemCount() }}</span>
              </a>
              <a class="nav-link text-white" (click)="logout()">
                <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Bienvenue, {{ userName }}</h2>
            <div class="cart-summary">
              <span class="me-3">Total panier: {{ formatNumber(cartService.cartTotal()) }} Ar</span>
              <button class="btn btn-primary" (click)="showCart = true; showProducts = false">
                <i class="fas fa-shopping-cart"></i> Voir Panier ({{ cartService.itemCount() }})
              </button>
            </div>
          </div>

          <!-- Section Produits -->
          <div *ngIf="showProducts">
            <!-- Barre de recherche -->
            <div class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <input type="text" class="form-control" placeholder="Rechercher produit..."
                           [(ngModel)]="searchQuery" (keyup.enter)="search()">
                  </div>
                  <div class="col-md-3">
                    <select class="form-select" [(ngModel)]="selectedCategory">
                      <option value="">Toutes catégories</option>
                      <option value="fashion">Mode</option>
                      <option value="electronics">Électronique</option>
                      <option value="food">Alimentation</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <button class="btn btn-primary w-100" (click)="search()">
                      <i class="fas fa-search"></i> Rechercher
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Liste des produits -->
            <div class="row">
              <div class="col-md-4 mb-4" *ngFor="let product of getPaginatedProducts()">
                <div class="card h-100">
                  <img [src]="product.image" class="card-img-top" [alt]="product.name"
                       style="height: 200px; object-fit: cover;">
                  <div class="card-body">
                    <h5 class="card-title">{{ product.name }}</h5>
                    <p class="card-text text-muted">{{ product.shopName }}</p>
                    <p class="card-text small">{{ product.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="h5 text-primary">{{ formatNumber(product.price) }} Ar</span>
                      <span class="badge" [ngClass]="{
                        'bg-success': product.stock > 20,
                        'bg-warning': product.stock <= 20 && product.stock > 5,
                        'bg-danger': product.stock <= 5
                      }">
                        Stock: {{ product.stock }}
                      </span>
                    </div>
                  </div>
                  <div class="card-footer">
                    <button class="btn btn-primary w-100" (click)="addToCart(product)"
                            [disabled]="product.stock === 0">
                      <i class="fas fa-cart-plus me-2"></i>
                      {{ product.stock === 0 ? 'Rupture' : 'Ajouter au panier' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-4" *ngIf="filteredProducts().length > pageSize">
              <div>
                Page {{ currentPage }} sur {{ totalPages() }}
                ({{ filteredProducts().length }} produits)
              </div>
              <div>
                <button class="btn btn-outline-primary me-2"
                        (click)="previousPage()" [disabled]="currentPage === 1">
                  <i class="fas fa-chevron-left"></i> Précédent
                </button>
                <button class="btn btn-outline-primary"
                        (click)="nextPage()" [disabled]="currentPage === totalPages()">
                  Suivant <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Section Panier -->
          <div *ngIf="showCart">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Mon Panier</h5>
                <button class="btn btn-outline-primary" (click)="showProducts = true; showCart = false">
                  <i class="fas fa-arrow-left me-2"></i>Retour aux produits
                </button>
              </div>
              <div class="card-body">
                <div *ngIf="cartService.cartItems().length === 0" class="text-center py-5">
                  <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                  <h5>Votre panier est vide</h5>
                  <p>Ajoutez des produits pour commencer vos achats</p>
                  <button class="btn btn-primary" (click)="showProducts = true; showCart = false">
                    <i class="fas fa-shopping-bag me-2"></i>Voir les produits
                  </button>
                </div>

                <div *ngIf="cartService.cartItems().length > 0">
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Prix unitaire</th>
                          <th>Quantité</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of cartService.cartItems()">
                          <td>
                            <div class="d-flex align-items-center">
                              <img [src]="item.image" [alt]="item.name"
                                   style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                              <div>
                                <strong>{{ item.name }}</strong><br>
                                <small class="text-muted">{{ item.shopName }}</small>
                              </div>
                            </div>
                          </td>
                          <td>{{ formatNumber(item.price) }} Ar</td>
                          <td>
                            <div class="d-flex align-items-center">
                              <button class="btn btn-sm btn-outline-secondary"
                                      (click)="updateQuantity(item.productId, item.quantity - 1)">
                                <i class="fas fa-minus"></i>
                              </button>
                              <span class="mx-2">{{ item.quantity }}</span>
                              <button class="btn btn-sm btn-outline-secondary"
                                      (click)="updateQuantity(item.productId, item.quantity + 1)">
                                <i class="fas fa-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td>{{ formatNumber(item.price * item.quantity) }} Ar</td>
                          <td>
                            <button class="btn btn-sm btn-danger"
                                    (click)="removeFromCart(item.productId)">
                              <i class="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="card mt-4">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-8">
                          <h5>Résumé de la commande</h5>
                          <div class="d-flex justify-content-between mb-2">
                            <span>Sous-total:</span>
                            <strong>{{ formatNumber(cartService.cartTotal()) }} Ar</strong>
                          </div>
                          <div class="d-flex justify-content-between mb-2">
                            <span>Livraison:</span>
                            <strong>Gratuite</strong>
                          </div>
                          <hr>
                          <div class="d-flex justify-content-between">
                            <span class="h5">Total:</span>
                            <span class="h4 text-primary">{{ formatNumber(cartService.cartTotal()) }} Ar</span>
                          </div>
                        </div>
                        <div class="col-md-4 d-flex align-items-center">
                          <button class="btn btn-success btn-lg w-100" (click)="checkout()">
                            <i class="fas fa-credit-card me-2"></i>Payer maintenant
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Paiement mobile simulé -->
                  <div class="card mt-4" *ngIf="showPayment">
                    <div class="card-header">
                      <h5 class="mb-0">Paiement Mobile</h5>
                    </div>
                    <div class="card-body">
                      <div class="mb-3">
                        <label class="form-label">Méthode de paiement</label>
                        <div class="d-flex gap-2">
                          <button class="btn btn-outline-primary"
                                  [class.active]="paymentMethod === 'mvola'"
                                  (click)="paymentMethod = 'mvola'">
                            <img src="https://via.placeholder.com/20/0066b3/ffffff?text=M"
                                 class="me-2" style="width: 20px;">
                            Mvola
                          </button>
                          <button class="btn btn-outline-danger"
                                  [class.active]="paymentMethod === 'airtel'"
                                  (click)="paymentMethod = 'airtel'">
                            <img src="https://via.placeholder.com/20/ed1c24/ffffff?text=A"
                                 class="me-2" style="width: 20px;">
                            Airtel Money
                          </button>
                          <button class="btn btn-outline-warning"
                                  [class.active]="paymentMethod === 'orange'"
                                  (click)="paymentMethod = 'orange'">
                            <img src="https://via.placeholder.com/20/ff7900/ffffff?text=O"
                                 class="me-2" style="width: 20px;">
                            Orange Money
                          </button>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="form-label">Numéro de téléphone</label>
                        <input type="tel" class="form-control"
                               [(ngModel)]="phoneNumber"
                               placeholder="034 XX XX XX">
                      </div>

                      <div class="mb-3" *ngIf="paymentMethod === 'mvola'">
                        <label class="form-label">Code PIN (4 chiffres)</label>
                        <input type="password" class="form-control"
                               [(ngModel)]="pinCode"
                               maxlength="4"
                               placeholder="0000">
                      </div>

                      <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Ceci est une simulation de paiement. Aucun vrai argent ne sera débité.
                      </div>

                      <div class="d-flex gap-2">
                        <button class="btn btn-primary" (click)="processPayment()">
                          <i class="fas fa-mobile-alt me-2"></i>
                          Simuler le paiement avec {{ getPaymentMethodName() }}
                        </button>
                        <button class="btn btn-outline-secondary" (click)="showPayment = false">
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-link {
      cursor: pointer;
      &:hover {
        background: rgba(255,255,255,0.1);
      }
    }

    .btn.active {
      background-color: var(--primary-color);
      color: white;
    }

    .card {
      transition: transform 0.3s;
      &:hover {
        transform: translateY(-2px);
      }
    }

    .cart-summary {
      background: #f8f9fa;
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }
  `]
})
export class BuyerDashboardComponent implements OnInit {
  userName = '';
  searchQuery = '';
  selectedCategory = '';
  currentPage = 1;
  pageSize = 6;
  showProducts = true;
  showCart = false;
  showPayment = false;
  paymentMethod = 'mvola';
  phoneNumber = '034 12 34 56';
  pinCode = '1234';

  allProducts: Product[] = [];
  filteredProducts = signal<Product[]>([]);

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private authService: AuthService
  ) {
    const user = this.authService.currentUserSig();
    this.userName = user?.name || 'Acheteur';
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.allProducts = this.productService.getAllProducts();
    this.filteredProducts.set(this.allProducts);
  }

  search() {
    let results = [...this.allProducts];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.some(c => c.toLowerCase().includes(query)) ||
        p.shopName.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory) {
      results = results.filter(p =>
        p.category.includes(this.selectedCategory)
      );
    }

    this.filteredProducts.set(results);
    this.currentPage = 1;
  }

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredProducts().slice(startIndex, endIndex);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProducts().length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  addToCart(product: Product) {
    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      shopId: product.shopId,
      shopName: product.shopName
    };

    this.cartService.addToCart(cartItem);
    alert(`${product.name} ajouté au panier!`);
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string) {
    if (confirm('Retirer ce produit du panier ?')) {
      this.cartService.removeFromCart(productId);
    }
  }

  checkout() {
    if (this.cartService.itemCount() === 0) {
      alert('Votre panier est vide');
      return;
    }
    this.showPayment = true;
  }

  getPaymentMethodName(): string {
    switch(this.paymentMethod) {
      case 'mvola': return 'Mvola';
      case 'airtel': return 'Airtel Money';
      case 'orange': return 'Orange Money';
      default: return '';
    }
  }

  processPayment() {
    if (!this.phoneNumber) {
      alert('Veuillez entrer un numéro de téléphone');
      return;
    }

    if (this.paymentMethod === 'mvola' && (!this.pinCode || this.pinCode.length !== 4)) {
      alert('Veuillez entrer un code PIN valide (4 chiffres)');
      return;
    }

    // Simulation de paiement
    const total = this.cartService.cartTotal();
    const formattedTotal = this.formatNumber(total);
    alert(`Paiement de ${formattedTotal} Ar effectué avec succès via ${this.getPaymentMethodName()}!`);

    // Vider le panier
    this.cartService.clearCart();

    // Réinitialiser
    this.showPayment = false;
    this.showCart = false;
    this.showProducts = true;

    alert('Commande confirmée! Vous recevrez une notification de livraison.');
  }

  formatNumber(num: number): string {
    return num.toLocaleString('fr-MG');
  }

  logout() {
    this.authService.logout();
  }
}
