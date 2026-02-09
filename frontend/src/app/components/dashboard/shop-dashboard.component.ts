
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-shop-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-dark text-white vh-100 p-0">
          <div class="p-4">
            <h4 class="text-center mb-4">{{ shopName }}</h4>
            <p class="text-center text-muted mb-4">{{ shopCategory }}</p>

            <nav class="nav flex-column">
              <a class="nav-link text-white" (click)="showDashboard = true; showProductsSection = false; showOrdersSection = false">
                <i class="fas fa-chart-line me-2"></i>Tableau de bord
              </a>
              <a class="nav-link text-white" (click)="showProductsSection = true; showDashboard = false; showOrdersSection = false">
                <i class="fas fa-boxes me-2"></i>Produits
              </a>
              <a class="nav-link text-white" (click)="showOrdersSection = true; showDashboard = false; showProductsSection = false">
                <i class="fas fa-shopping-bag me-2"></i>Commandes
              </a>
              <a class="nav-link text-white" (click)="logout()">
                <i class="fas fa-sign-out-alt me-2"></i>Déconnexion
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 p-4">
          <!-- Tableau de bord -->
          <div *ngIf="showDashboard">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2>Tableau de bord</h2>
              <div class="text-muted">
                <i class="fas fa-calendar-alt me-2"></i>
                {{ getCurrentDate() }}
              </div>
            </div>

            <!-- Cartes de statistiques -->
            <div class="row mb-4">
              <div class="col-md-4 mb-3">
                <div class="card border-primary">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="text-muted">Chiffre d'affaires</h6>
                        <h3 class="text-primary">{{ formatNumber(totalRevenue) }} Ar</h3>
                        <small class="text-success">
                          <i class="fas fa-arrow-up me-1"></i>12% vs mois dernier
                        </small>
                      </div>
                      <div class="bg-primary text-white rounded-circle p-3">
                        <i class="fas fa-money-bill-wave fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-3">
                <div class="card border-warning">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="text-muted">Produits en stock bas</h6>
                        <h3 class="text-warning">{{ lowStockCount }}</h3>
                        <small>À réapprovisionner</small>
                      </div>
                      <div class="bg-warning text-white rounded-circle p-3">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-3">
                <div class="card border-success">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 class="text-muted">Total produits</h6>
                        <h3 class="text-success">{{ shopProducts.length }}</h3>
                        <small>Produits actifs</small>
                      </div>
                      <div class="bg-success text-white rounded-circle p-3">
                        <i class="fas fa-box fa-2x"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alertes stock bas -->
            <div class="card mb-4">
              <div class="card-header bg-warning text-white">
                <i class="fas fa-exclamation-circle me-2"></i>
                Alertes stock bas
              </div>
              <div class="card-body">
                <div *ngIf="lowStockProducts.length === 0" class="text-center py-3">
                  <i class="fas fa-check-circle text-success fa-2x mb-2"></i>
                  <p class="mb-0">Aucun produit en stock bas</p>
                </div>

                <div *ngIf="lowStockProducts.length > 0">
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Stock actuel</th>
                          <th>Seuil bas</th>
                          <th>Quantité à commander</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let product of lowStockProducts; let i = index" class="order-item">
                          <td>
                            <strong>{{ product.name }}</strong><br>
                            <small class="text-muted">{{ product.category.join(', ') }}</small>
                          </td>
                          <td>
                            <span class="badge bg-danger">{{ product.stock }}</span>
                          </td>
                          <td>10</td>
                          <td>
                            <div class="input-group" style="max-width: 150px;">
                              <input type="number" class="form-control form-control-sm"
                                     [(ngModel)]="restockQuantities[i]" min="1" max="100">
                              <span class="input-group-text">unités</span>
                            </div>
                          </td>
                          <td>
                            <button class="btn btn-sm btn-success"
                                    (click)="restockProduct(product, i)">
                              <i class="fas fa-plus me-1"></i>Commander
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dernières commandes -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Dernières commandes</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Commande</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let order of getPaginatedOrders()" class="order-item">
                        <td><strong>#{{ order.id }}</strong></td>
                        <td>{{ order.customer }}</td>
                        <td>{{ order.date }}</td>
                        <td>{{ formatNumber(order.total) }} Ar</td>
                        <td>
                          <span class="badge" [ngClass]="{
                            'bg-warning': order.status === 'pending',
                            'bg-info': order.status === 'preparing',
                            'bg-success': order.status === 'ready',
                            'bg-primary': order.status === 'delivered',
                            'bg-danger': order.status === 'cancelled'
                          }">
                            {{ getStatusText(order.status) }}
                          </span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary"
                                  (click)="viewOrderDetails(order)">
                            <i class="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination commandes -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <small>
                    Affichage {{ getOrderStartIndex() }} - {{ getOrderEndIndex() }}
                    sur {{ filteredOrders().length }} commandes
                  </small>
                  <div>
                    <button class="btn btn-sm btn-outline-secondary"
                            (click)="previousOrdersPage()"
                            [disabled]="ordersCurrentPage === 1">
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="mx-2">Page {{ ordersCurrentPage }}</span>
                    <button class="btn btn-sm btn-outline-secondary"
                            (click)="nextOrdersPage()"
                            [disabled]="ordersCurrentPage === totalOrdersPages()">
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Produits -->
          <div *ngIf="showProductsSection">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2>Gestion des produits</h2>
              <button class="btn btn-primary" (click)="showAddForm = true">
                <i class="fas fa-plus me-2"></i>Ajouter un produit
              </button>
            </div>

            <!-- Formulaire ajout produit -->
            <div class="card mb-4" *ngIf="showAddForm">
              <div class="card-header bg-primary text-white">
                <i class="fas fa-plus-circle me-2"></i>
                Nouveau produit
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nom du produit *</label>
                    <input type="text" class="form-control"
                           [(ngModel)]="newProduct.name"
                           placeholder="Ex: Chemise Blanche Homme">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Catégorie</label>
                    <input type="text" class="form-control"
                           [(ngModel)]="newProduct.category"
                           placeholder="Ex: Mode, Vêtements">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Prix (Ar) *</label>
                    <input type="number" class="form-control"
                           [(ngModel)]="newProduct.price"
                           min="0" step="100">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Stock initial *</label>
                    <input type="number" class="form-control"
                           [(ngModel)]="newProduct.stock"
                           min="0">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" rows="3"
                            [(ngModel)]="newProduct.description"
                            placeholder="Description du produit..."></textarea>
                </div>

                <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-success" (click)="addProduct()">
                    <i class="fas fa-save me-2"></i>Enregistrer
                  </button>
                  <button class="btn btn-outline-secondary" (click)="cancelAddProduct()">
                    Annuler
                  </button>
                </div>
              </div>
            </div>

            <!-- Liste des produits -->
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Liste des produits</h5>
                <div>
                  <button class="btn btn-sm btn-outline-primary me-2" (click)="exportProductsPDF()">
                    <i class="fas fa-file-pdf me-1"></i>PDF
                  </button>
                  <button class="btn btn-sm btn-outline-success" (click)="exportProductsExcel()">
                    <i class="fas fa-file-excel me-1"></i>Excel
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Prix (Ar)</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let product of shopProducts.slice((currentPage-1)*pageSize, currentPage*pageSize)"
                          class="order-item">
                        <td>
                          <div class="bg-light d-flex align-items-center justify-content-center"
                               style="width: 60px; height: 60px;">
                            <i class="fas fa-image text-muted"></i>
                          </div>
                        </td>
                        <td>
                          <strong>{{ product.name }}</strong><br>
                          <small class="text-muted">{{ product.description }}</small>
                        </td>
                        <td>
                          <span class="badge bg-secondary">
                            {{ product.category.join(', ') }}
                          </span>
                        </td>
                        <td>{{ formatNumber(product.price) }}</td>
                        <td>
                          <span class="badge" [ngClass]="{
                            'bg-success': product.stock > 20,
                            'bg-warning': product.stock <= 20 && product.stock > 5,
                            'bg-danger': product.stock <= 5
                          }">
                            {{ product.stock }}
                          </span>
                        </td>
                        <td>
                          <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary"
                                    (click)="editProduct(product)">
                              <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning"
                                    (click)="quickRestock(product)">
                              <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger"
                                    (click)="deleteProduct(product.id)">
                              <i class="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination produits -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <small>
                    Affichage {{ getProductStartIndex() }} - {{ getProductEndIndex() }}
                    sur {{ shopProducts.length }} produits
                  </small>
                  <div>
                    <button class="btn btn-sm btn-outline-secondary"
                            (click)="previousProductPage()"
                            [disabled]="currentPage === 1">
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="mx-2">Page {{ currentPage }}</span>
                    <button class="btn btn-sm btn-outline-secondary"
                            (click)="nextProductPage()"
                            [disabled]="currentPage === totalProductPages()">
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Commandes -->
          <div *ngIf="showOrdersSection">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2>Gestion des commandes</h2>
              <div>
                <button class="btn btn-outline-primary me-2" (click)="exportOrdersPDF()">
                  <i class="fas fa-file-pdf me-1"></i>PDF
                </button>
                <button class="btn btn-outline-success" (click)="exportOrdersExcel()">
                  <i class="fas fa-file-excel me-1"></i>Excel
                </button>
              </div>
            </div>

            <!-- Filtres -->
            <div class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Statut</label>
                    <select class="form-select" [(ngModel)]="orderFilterStatus">
                      <option value="">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="preparing">En préparation</option>
                      <option value="ready">Prêt à livrer</option>
                      <option value="delivered">Livré</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Date début</label>
                    <input type="date" class="form-control" [(ngModel)]="orderStartDate">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Date fin</label>
                    <input type="date" class="form-control" [(ngModel)]="orderEndDate">
                  </div>
                </div>
              </div>
            </div>

            <!-- Liste des commandes -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Commandes récentes</h5>
              </div>
              <div class="card-body">
                <div *ngFor="let order of getPaginatedOrders()" class="card mb-3 order-item">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5>Commande #{{ order.id }}</h5>
                        <p class="text-muted mb-1">
                          <i class="fas fa-user me-1"></i>{{ order.customer }}
                        </p>
                        <small class="text-muted">
                          <i class="fas fa-calendar me-1"></i>{{ order.date }}
                        </small>
                      </div>
                      <div class="text-end">
                        <h4 class="text-primary">{{ formatNumber(order.total) }} Ar</h4>
                        <span class="badge" [ngClass]="{
                          'bg-warning': order.status === 'pending',
                          'bg-info': order.status === 'preparing',
                          'bg-success': order.status === 'ready',
                          'bg-primary': order.status === 'delivered',
                          'bg-danger': order.status === 'cancelled'
                        }">
                          {{ getStatusText(order.status) }}
                        </span>
                      </div>
                    </div>

                    <!-- Articles de la commande -->
                    <div class="mb-3">
                      <h6>Articles</h6>
                      <div class="row">
                        <div class="col-md-6 mb-2" *ngFor="let item of order.items">
                          <div class="d-flex align-items-center bg-light p-2 rounded">
                            <div class="bg-white p-1 me-2 rounded">
                              <i class="fas fa-box text-muted"></i>
                            </div>
                            <div class="flex-grow-1">
                              <strong>{{ item.name }}</strong><br>
                              <small>{{ item.quantity }} × {{ formatNumber(item.price) }} Ar</small>
                            </div>
                            <div class="text-end">
                              <strong>{{ formatNumber(item.price * item.quantity) }} Ar</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Timeline de suivi -->
                    <div class="timeline mb-3">
                      <div class="timeline-step" [class.active]="order.status === 'pending'">
                        <div class="step-circle">1</div>
                        <span>En attente</span>
                      </div>
                      <div class="timeline-step" [class.active]="order.status === 'preparing'">
                        <div class="step-circle">2</div>
                        <span>En préparation</span>
                      </div>
                      <div class="timeline-step" [class.active]="order.status === 'ready'">
                        <div class="step-circle">3</div>
                        <span>Prêt</span>
                      </div>
                      <div class="timeline-step" [class.active]="order.status === 'delivered'">
                        <div class="step-circle">4</div>
                        <span>Livré</span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="d-flex justify-content-end gap-2">
                      <button class="btn btn-outline-primary" (click)="viewOrderDetails(order)">
                        <i class="fas fa-eye me-1"></i>Détails
                      </button>
                      <button class="btn btn-outline-success" (click)="printOrder(order)">
                        <i class="fas fa-print me-1"></i>Imprimer
                      </button>
                      <div class="btn-group">
                        <button class="btn btn-outline-secondary"
                                (click)="updateOrderStatus(order.id, 'preparing')"
                                [disabled]="order.status !== 'pending'">
                          En préparation
                        </button>
                        <button class="btn btn-outline-warning"
                                (click)="updateOrderStatus(order.id, 'ready')"
                                [disabled]="order.status !== 'preparing'">
                          Prêt
                        </button>
                        <button class="btn btn-outline-success"
                                (click)="updateOrderStatus(order.id, 'delivered')"
                                [disabled]="order.status !== 'ready'">
                          Livré
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pagination commandes -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <small>
                    Affichage {{ getOrderStartIndex() }} - {{ getOrderEndIndex() }}
                    sur {{ filteredOrders().length }} commandes
                  </small>
                  <div>
                    <button class="btn btn-sm btn-outline-secondary"
                            (click)="previousOrdersPage()"
                            [disabled]="ordersCurrentPage === 1">
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="mx-2">Page {{ ordersCurrentPage }}</span>
                    <button class="btn btn-sm btn-outline-secondary"
                            (click)="nextOrdersPage()"
                            [disabled]="ordersCurrentPage === totalOrdersPages()">
                      <i class="fas fa-chevron-right"></i>
                    </button>
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
      transition: all 0.3s;
      border-radius: 5px;
      padding: 10px 15px;
      margin: 3px 0;

      &:hover {
        background: rgba(255,255,255,0.1);
        transform: translateX(5px);
      }
    }

    .card {
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin: 20px 0;

      &::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 0;
        right: 0;
        height: 2px;
        background: #dee2e6;
        z-index: 1;
      }
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      flex: 1;

      &.active {
        .step-circle {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        span {
          font-weight: bold;
          color: var(--primary-color);
        }
      }
    }

    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: white;
      border: 2px solid #dee2e6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .order-item {
      background: #f8f9fa;
      transition: all 0.3s;

      &:hover {
        background: #e9ecef;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
    }

    .btn-group .btn {
      border-radius: 5px !important;
      margin: 0 2px;
    }
  `]
})
export class ShopDashboardComponent implements OnInit {
  // Informations boutique
  shopName = 'Zara Ivandry';
  shopCategory = 'Mode';

  // Navigation
  showDashboard = true;
  showProductsSection = false;
  showOrdersSection = false;

  // Gestion produits
  showAddForm = false;
  shopProducts: Product[] = [];
  lowStockProducts: Product[] = [];
  restockQuantities: number[] = []; // Stocker les quantités séparément
  lowStockCount = 0;
  totalRevenue = 450000;

  currentPage = 1;
  pageSize = 10;

  // Gestion commandes
  demoOrders: any[] = [];
  orderFilterStatus = '';
  orderStartDate = '';
  orderEndDate = '';

  ordersCurrentPage = 1;
  ordersPageSize = 5;

  // Nouveau produit
  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  };

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadShopProducts();
    this.loadDemoOrders();
  }

  loadShopProducts() {
    // Pour la démo, on prend les produits de Zara (shopId: s1)
    this.shopProducts = this.productService.getAllProducts()
      .filter(p => p.shopId === 's1');

    this.lowStockProducts = this.shopProducts.filter(p => p.stock <= 10);
    this.lowStockCount = this.lowStockProducts.length;

    // Initialiser les quantités de réapprovisionnement
    this.restockQuantities = this.lowStockProducts.map(() => 10);
  }

  loadDemoOrders() {
    this.demoOrders = [
      {
        id: '001',
        customer: 'Jean Dupont',
        total: 90000,
        status: 'pending',
        date: '2024-01-20',
        items: [
          { name: 'Chemise Blanche Homme', price: 45000, quantity: 2 }
        ]
      },
      {
        id: '002',
        customer: 'Marie Lambert',
        total: 45000,
        status: 'preparing',
        date: '2024-01-19',
        items: [
          { name: 'T-shirt Décontracté', price: 25000, quantity: 1 },
          { name: 'Chemise Blanche Homme', price: 45000, quantity: 1 }
        ]
      },
      {
        id: '003',
        customer: 'Paul Martin',
        total: 125000,
        status: 'delivered',
        date: '2024-01-18',
        items: [
          { name: 'Jean Slim Noir', price: 85000, quantity: 1 },
          { name: 'Chemise Blanche Homme', price: 45000, quantity: 1 }
        ]
      },
      {
        id: '004',
        customer: 'Sophie Petit',
        total: 25000,
        status: 'ready',
        date: '2024-01-21',
        items: [
          { name: 'T-shirt Décontracté', price: 25000, quantity: 1 }
        ]
      },
      {
        id: '005',
        customer: 'Robert Durand',
        total: 85000,
        status: 'pending',
        date: '2024-01-21',
        items: [
          { name: 'Jean Slim Noir', price: 85000, quantity: 1 }
        ]
      }
    ];
  }

  // Méthodes utilitaires
  formatNumber(num: number): string {
    return num.toLocaleString('fr-MG');
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-MG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': 'En attente',
      'preparing': 'En préparation',
      'ready': 'Prêt à livrer',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
  }

  // Méthodes pour la pagination (pour remplacer Math.min dans le template)
  getProductStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getProductEndIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.shopProducts.length ? this.shopProducts.length : end;
  }

  getOrderStartIndex(): number {
    return (this.ordersCurrentPage - 1) * this.ordersPageSize + 1;
  }

  getOrderEndIndex(): number {
    const end = this.ordersCurrentPage * this.ordersPageSize;
    const total = this.filteredOrders().length;
    return end > total ? total : end;
  }

  // Gestion produits
  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.stock) {
      alert('Veuillez remplir les champs obligatoires (Nom, Prix, Stock)');
      return;
    }

    const product: any = {
      name: this.newProduct.name,
      description: this.newProduct.description,
      price: this.newProduct.price,
      stock: this.newProduct.stock,
      image: '',
      category: this.newProduct.category ? [this.newProduct.category] : ['non-catégorisé'],
      shopId: 's1',
      shopName: this.shopName,
      isActive: true
    };

    this.productService.addProduct(product);
    this.loadShopProducts();

    // Réinitialiser le formulaire
    this.newProduct = { name: '', description: '', price: 0, stock: 0, category: '' };
    this.showAddForm = false;

    alert('Produit ajouté avec succès!');
  }

  cancelAddProduct() {
    this.newProduct = { name: '', description: '', price: 0, stock: 0, category: '' };
    this.showAddForm = false;
  }

  editProduct(product: Product) {
    const newName = prompt('Nouveau nom:', product.name);
    if (newName) {
      const newPrice = prompt('Nouveau prix:', product.price.toString());
      if (newPrice) {
        this.productService.updateProduct(product.id, {
          name: newName,
          price: Number(newPrice)
        });
        this.loadShopProducts();
        alert('Produit mis à jour!');
      }
    }
  }

  deleteProduct(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id);
      this.loadShopProducts();
      alert('Produit supprimé!');
    }
  }

  quickRestock(product: Product) {
    const quantity = prompt(`Quantité à ajouter au stock de "${product.name}" :`, '10');
    if (quantity && !isNaN(Number(quantity))) {
      const newStock = product.stock + Number(quantity);
      this.productService.updateProduct(product.id, { stock: newStock });
      this.loadShopProducts();
      alert(`Stock mis à jour: ${newStock} unités`);
    }
  }

  restockProduct(product: Product, index: number) {
    const quantity = this.restockQuantities[index];

    if (!quantity || quantity <= 0) {
      alert('Veuillez entrer une quantité valide');
      return;
    }

    const newStock = product.stock + Number(quantity);
    this.productService.updateProduct(product.id, { stock: newStock });
    this.loadShopProducts();

    // Réinitialiser la quantité
    this.restockQuantities[index] = 10;

    alert(`Stock de "${product.name}" mis à jour: ${newStock} unités`);
  }

  // Pagination produits
  totalProductPages(): number {
    return Math.ceil(this.shopProducts.length / this.pageSize);
  }

  previousProductPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextProductPage() {
    if (this.currentPage < this.totalProductPages()) {
      this.currentPage++;
    }
  }

  // Gestion commandes
  filteredOrders() {
    let orders = [...this.demoOrders];

    if (this.orderFilterStatus) {
      orders = orders.filter(o => o.status === this.orderFilterStatus);
    }

    // Filtrage par date (simplifié)
    if (this.orderStartDate) {
      orders = orders.filter(o => o.date >= this.orderStartDate);
    }

    if (this.orderEndDate) {
      orders = orders.filter(o => o.date <= this.orderEndDate);
    }

    return orders;
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    const order = this.demoOrders.find(o => o.id === orderId);
    if (order) {
      const oldStatus = order.status;
      order.status = newStatus;
      alert(`Commande #${orderId} : ${this.getStatusText(oldStatus)} → ${this.getStatusText(newStatus)}`);
    }
  }

  getPaginatedOrders() {
    const startIndex = (this.ordersCurrentPage - 1) * this.ordersPageSize;
    const endIndex = startIndex + this.ordersPageSize;
    return this.filteredOrders().slice(startIndex, endIndex);
  }

  totalOrdersPages(): number {
    return Math.ceil(this.filteredOrders().length / this.ordersPageSize);
  }

  previousOrdersPage() {
    if (this.ordersCurrentPage > 1) {
      this.ordersCurrentPage--;
    }
  }

  nextOrdersPage() {
    if (this.ordersCurrentPage < this.totalOrdersPages()) {
      this.ordersCurrentPage++;
    }
  }

  viewOrderDetails(order: any) {
    alert(`Détails de la commande #${order.id}\n\n` +
          `Client: ${order.customer}\n` +
          `Total: ${this.formatNumber(order.total)} Ar\n` +
          `Statut: ${this.getStatusText(order.status)}\n` +
          `Date: ${order.date}\n\n` +
          `Articles:\n${order.items.map((item: any) =>
            `- ${item.name} (${item.quantity} × ${this.formatNumber(item.price)} Ar)`
          ).join('\n')}`);
  }

  printOrder(order: any) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Facture #${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #1a237e; }
              .header { text-align: center; margin-bottom: 30px; }
              .details { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f8f9fa; }
              .total { font-size: 1.2em; font-weight: bold; text-align: right; }
              .footer { margin-top: 40px; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Facture #${order.id}</h1>
              <p>${this.shopName}</p>
            </div>
            <div class="details">
              <p><strong>Client:</strong> ${order.customer}</p>
              <p><strong>Date:</strong> ${order.date}</p>
              <p><strong>Statut:</strong> ${this.getStatusText(order.status)}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix unitaire</th>
                  <th>Quantité</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${this.formatNumber(item.price)} Ar</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatNumber(item.price * item.quantity)} Ar</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              Total: ${this.formatNumber(order.total)} Ar
            </div>
            <div class="footer">
              <p>Merci pour votre achat !</p>
              <p>SOA PLAZA Shopping Center</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Export PDF/Excel
  exportProductsPDF() {
    try {
      alert('PDF exporté (simulation) - ' + this.shopProducts.length + ' produits');
    } catch (error) {
      console.error('Erreur PDF:', error);
      alert('PDF exporté (simulation) - ' + this.shopProducts.length + ' produits');
    }
  }

  exportProductsExcel() {
    // Simulation d'export Excel
    const data = {
      boutique: this.shopName,
      date: new Date().toLocaleDateString('fr-MG'),
      produits: this.shopProducts.map(p => ({
        nom: p.name,
        description: p.description,
        prix: p.price,
        stock: p.stock,
        catégorie: p.category.join(', ')
      }))
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'produits-' + this.shopName + '.json');
    linkElement.click();

    alert('Données exportées (simulation Excel)!');
  }

  exportOrdersPDF() {
    alert('PDF des commandes exporté (simulation) - ' + this.demoOrders.length + ' commandes');
  }

  exportOrdersExcel() {
    alert('Export Excel des commandes simulé!');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
