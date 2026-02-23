import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-dashboard">
      <!-- Menu Fixe Très Simple -->
      <div class="fixed-menu">
        <div class="menu-header" (click)="toggleMenu()">
          <div class="menu-logo">I</div>
          <span class="menu-title" *ngIf="!menuCollapsed">IMPERIA</span>
          <div class="menu-toggle">
            <i
              class="fas"
              [class.fa-bars]="menuCollapsed"
              [class.fa-times]="!menuCollapsed"
            ></i>
          </div>
        </div>

        <nav class="menu-nav" [class.collapsed]="menuCollapsed">
          <a
            class="menu-item"
            (click)="selectSection('dashboard')"
            [class.active]="currentSection === 'dashboard'"
          >
            <i class="fas fa-tachometer-alt"></i>
            <span *ngIf="!menuCollapsed">Dashboard</span>
          </a>

          <a
            class="menu-item"
            (click)="selectSection('pendingShops')"
            [class.active]="currentSection === 'pendingShops'"
          >
            <i class="fas fa-clock"></i>
            <span *ngIf="!menuCollapsed">Demandes</span>
            <span
              class="badge"
              *ngIf="pendingShops.length > 0 && !menuCollapsed"
              >{{ pendingShops.length }}</span
            >
          </a>

          <a
            class="menu-item"
            (click)="selectSection('activeShops')"
            [class.active]="currentSection === 'activeShops'"
          >
            <i class="fas fa-store"></i>
            <span *ngIf="!menuCollapsed">Boutiques</span>
          </a>

          <a
            class="menu-item"
            (click)="selectSection('users')"
            [class.active]="currentSection === 'users'"
          >
            <i class="fas fa-users"></i>
            <span *ngIf="!menuCollapsed">Utilisateurs</span>
          </a>

          <a class="menu-item logout" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            <span *ngIf="!menuCollapsed">Déconnexion</span>
          </a>
        </nav>
      </div>

      <!-- Contenu Principal -->
      <div class="main-content" [class.menu-collapsed]="menuCollapsed">
        <!-- Dashboard -->
        <div *ngIf="currentSection === 'dashboard'" class="dashboard-section">
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-store"></i>
              <div class="stat-info">
                <h3>{{ activeShopsCount }}</h3>
                <p>Boutiques actives</p>
              </div>
            </div>

            <div class="stat-card">
              <i class="fas fa-clock"></i>
              <div class="stat-info">
                <h3>{{ pendingShops.length }}</h3>
                <p>En attente</p>
              </div>
            </div>

            <div class="stat-card">
              <i class="fas fa-users"></i>
              <div class="stat-info">
                <h3>{{ allUsers.length }}</h3>
                <p>Utilisateurs</p>
              </div>
            </div>

            <div class="stat-card">
              <i class="fas fa-chart-line"></i>
              <div class="stat-info">
                <h3>{{ formatNumber(totalRevenue) }}</h3>
                <p>Chiffre d'affaires</p>
              </div>
            </div>
          </div>

          <!-- Demandes Urgentes -->
          <div class="urgent-section" *ngIf="pendingShops.length > 0">
            <h3><i class="fas fa-exclamation-circle"></i> Demandes urgentes</h3>
            <div class="urgent-list">
              <div
                class="urgent-item"
                *ngFor="let shop of pendingShops.slice(0, 3)"
              >
                <div class="urgent-icon">
                  <i class="fas fa-store"></i>
                </div>
                <div class="urgent-info">
                  <strong>{{ shop.name }}</strong>
                  <p>{{ shop.manager }}</p>
                </div>
                <button
                  class="btn-action"
                  (click)="selectSection('pendingShops')"
                >
                  Traiter
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Demandes en attente -->
        <div *ngIf="currentSection === 'pendingShops'" class="pending-section">
          <div class="section-header">
            <h2><i class="fas fa-clock"></i> Demandes en attente</h2>
            <span class="count-badge">{{ pendingShops.length }}</span>
          </div>

          <div *ngIf="pendingShops.length === 0" class="empty-message">
            <i class="fas fa-check-circle"></i>
            <p>Aucune demande en attente</p>
          </div>

          <div class="pending-list" *ngIf="pendingShops.length > 0">
            <div class="pending-card" *ngFor="let shop of pendingShops">
              <div class="card-header">
                <h4>{{ shop.name }}</h4>
                <span class="category">{{
                  getCategoryLabel(shop.category)
                }}</span>
              </div>

              <div class="card-body">
                <div class="info-row">
                  <i class="fas fa-user-tie"></i>
                  <span>{{ shop.manager }}</span>
                </div>
                <div class="info-row">
                  <i class="fas fa-envelope"></i>
                  <span>{{ shop.email }}</span>
                </div>
                <div class="info-row">
                  <i class="fas fa-phone"></i>
                  <span>{{ shop.phone }}</span>
                </div>
                <div class="info-row">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatDate(shop.requestDate) }}</span>
                </div>
              </div>

              <div class="card-actions">
                <select
                  [(ngModel)]="shop.assignedLocation"
                  class="location-select"
                >
                  <option value="">Choisir emplacement</option>
                  <option value="Niveau 1">Niveau 1</option>
                  <option value="Niveau 2">Niveau 2</option>
                  <option value="Food Court">Food Court</option>
                </select>

                <div class="action-buttons">
                  <button
                    class="btn-success"
                    (click)="approveShop(shop)"
                    [disabled]="!shop.assignedLocation"
                  >
                    <i class="fas fa-check"></i> Valider
                  </button>
                  <button class="btn-danger" (click)="rejectShop(shop)">
                    <i class="fas fa-times"></i> Refuser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutiques actives -->
        <div *ngIf="currentSection === 'activeShops'" class="shops-section">
          <div class="section-header">
            <h2><i class="fas fa-store"></i> Boutiques actives</h2>
            <div class="header-actions">
              <input
                type="text"
                placeholder="Rechercher..."
                [(ngModel)]="searchQuery"
                class="search-input"
              />
              <button class="btn-primary" (click)="addShop()">
                <i class="fas fa-plus"></i> Ajouter
              </button>
            </div>
          </div>

          <div class="shops-grid">
            <div class="shop-card" *ngFor="let shop of getFilteredShops()">
              <div class="shop-icon" [ngClass]="'category-' + shop.category">
                <i [class]="getCategoryIcon(shop.category)"></i>
              </div>

              <div class="shop-info">
                <h4>{{ shop.name }}</h4>
                <p class="manager">{{ shop.manager }}</p>
                <p class="location">
                  <i class="fas fa-map-marker-alt"></i>
                  {{ shop.location }}
                </p>
                <p class="revenue">
                  <i class="fas fa-chart-line"></i>
                  {{ formatNumber(shop.revenue || 0) }} MGA/mois
                </p>
              </div>

              <div class="shop-status" [ngClass]="shop.status">
                {{ shop.status === 'active' ? 'ACTIF' : 'SUSPENDU' }}
              </div>

              <div class="shop-actions">
                <button class="btn-icon" (click)="viewShop(shop)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" (click)="editShop(shop)">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn-icon"
                  [ngClass]="
                    shop.status === 'active' ? 'btn-danger' : 'btn-success'
                  "
                  (click)="toggleShopStatus(shop)"
                >
                  <i
                    [class]="
                      shop.status === 'active' ? 'fas fa-ban' : 'fas fa-check'
                    "
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Utilisateurs -->
        <div *ngIf="currentSection === 'users'" class="users-section">
          <div class="section-header">
            <h2><i class="fas fa-users"></i> Utilisateurs</h2>
            <button class="btn-primary" (click)="showCreateForm = true">
              <i class="fas fa-user-plus"></i> Nouveau
            </button>
          </div>

          <!-- Formulaire création -->
          <div class="create-form" *ngIf="showCreateForm">
            <div class="form-header">
              <h4>Nouvel utilisateur</h4>
              <button class="btn-icon" (click)="showCreateForm = false">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="form-body">
              <input
                type="text"
                placeholder="Nom complet"
                [(ngModel)]="newUser.name"
              />
              <input
                type="email"
                placeholder="Email"
                [(ngModel)]="newUser.email"
              />
              <select [(ngModel)]="newUser.role">
                <option value="">Rôle</option>
                <option value="admin">Administrateur</option>
                <option value="shop">Gérant boutique</option>
                <option value="buyer">Client</option>
              </select>
              <input
                type="password"
                placeholder="Mot de passe"
                [(ngModel)]="newUser.password"
              />
              <div class="form-actions">
                <button class="btn-success" (click)="createUser()">
                  Créer
                </button>
                <button class="btn-outline" (click)="showCreateForm = false">
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <!-- Liste utilisateurs -->
          <div class="users-grid">
            <div class="user-card" *ngFor="let user of allUsers">
              <div class="user-avatar" [ngClass]="'role-' + user.role">
                <i [class]="getRoleIcon(user.role)"></i>
              </div>

              <div class="user-info">
                <h4>{{ user.name }}</h4>
                <p class="email">{{ user.email }}</p>
                <p class="role">{{ getRoleLabel(user.role) }}</p>
                <p class="date">Inscrit le {{ formatDate(user.createdAt) }}</p>
              </div>

              <div
                class="user-status"
                [ngClass]="user.active ? 'active' : 'inactive'"
              >
                {{ user.active ? 'ACTIF' : 'INACTIF' }}
              </div>

              <div class="user-actions">
                <button class="btn-icon" (click)="resetPassword(user)">
                  <i class="fas fa-key"></i>
                </button>
                <button
                  class="btn-icon"
                  [ngClass]="user.active ? 'btn-danger' : 'btn-success'"
                  (click)="toggleUserStatus(user)"
                >
                  <i [class]="user.active ? 'fas fa-ban' : 'fas fa-check'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --primary-color: #d4af37;
        --dark-bg: #1a1a1a;
        --light-bg: #f5f5f5;
        --card-bg: #ffffff;
        --text-dark: #333333;
        --text-light: #666666;
        --success: #28a745;
        --warning: #ffc107;
        --danger: #dc3545;
        --info: #17a2b8;
      }

      .admin-dashboard {
        display: flex;
        min-height: 100vh;
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

        /* 1. Par défaut (Mobile) : Pas de marge */
        margin-left: 0;
      }

      /* 2. On ajoute la marge UNIQUEMENT si l'écran est large (ex: > 768px pour une sidebar) */
      @media (min-width: 768px) {
        .admin-dashboard {
          margin-left: 130px;
        }
      }

      /* Menu Fixe Minimal */
      .fixed-menu {
        width: 60px;
        height: 100vh;
        background: var(--dark-bg);
        color: white;
        position: fixed;
        top: 1;
        left: 0;
        bottom: 1;
        transition: width 0.3s ease;
        overflow: hidden;
        z-index: 1000;
      }

      .fixed-menu:hover,
      .fixed-menu:not(.collapsed) {
        width: 200px;
      }

      .menu-header {
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .menu-logo {
        width: 40px;
        height: 40px;
        background: var(--primary-color);
        color: var(--dark-bg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .menu-title {
        font-weight: 600;
        font-size: 1.1rem;
        white-space: nowrap;
      }

      .menu-toggle {
        margin-left: auto;
        display: none;
      }

      .menu-nav {
        padding: 20px 0;
        display: flex;
        flex-direction: column;
      }

      .menu-item {
        padding: 12px 20px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .menu-item:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }

      .menu-item.active {
        background: rgba(212, 175, 55, 0.2);
        color: var(--primary-color);
        border-left: 3px solid var(--primary-color);
      }

      .menu-item i {
        width: 20px;
        text-align: center;
      }

      .menu-item span {
        font-size: 0.9rem;
      }

      .menu-item .badge {
        background: var(--danger);
        color: white;
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: auto;
      }

      .menu-item.logout {
        margin-top: auto;
        color: var(--danger);
      }

      .menu-item.logout:hover {
        background: rgba(220, 53, 69, 0.1);
      }

      /* Contenu Principal */
      .main-content {
        flex: 1;
        margin-left: 60px;
        background: var(--light-bg);
        padding: 20px;
        transition: margin-left 0.3s ease;
        min-height: 100vh;
      }

      .main-content.menu-collapsed {
        margin-left: 60px;
      }

      /* Dashboard */
      .dashboard-section {
        max-width: 1400px;
        margin: 0 auto;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .stat-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .stat-card:hover {
        transform: translateY(-5px);
      }

      .stat-card i {
        font-size: 2rem;
        color: var(--primary-color);
      }

      .stat-info h3 {
        margin: 0;
        font-size: 1.8rem;
        color: var(--text-dark);
      }

      .stat-info p {
        margin: 5px 0 0;
        color: var(--text-light);
        font-size: 0.9rem;
      }

      /* Urgent Section */
      .urgent-section {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .urgent-section h3 {
        margin: 0 0 20px;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .urgent-section h3 i {
        color: var(--warning);
      }

      .urgent-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .urgent-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255, 193, 7, 0.1);
        border-radius: 8px;
        border-left: 4px solid var(--warning);
      }

      .urgent-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 193, 7, 0.2);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--warning);
      }

      .urgent-info {
        flex: 1;
      }

      .urgent-info strong {
        display: block;
        color: var(--text-dark);
        margin-bottom: 5px;
      }

      .urgent-info p {
        margin: 0;
        color: var(--text-light);
        font-size: 0.9rem;
      }

      .btn-action {
        background: var(--warning);
        color: var(--text-dark);
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-action:hover {
        background: #e0a800;
        transform: translateY(-2px);
      }

      /* Sections communes */
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.1);
      }

      .section-header h2 {
        margin: 0;
        color: var(--text-dark);
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .section-header h2 i {
        color: var(--primary-color);
      }

      .count-badge {
        background: var(--primary-color);
        color: white;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .header-actions {
        display: flex;
        gap: 15px;
        align-items: center;
      }

      .search-input {
        padding: 10px 15px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 0.9rem;
        min-width: 250px;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      /* Boutons */
      .btn-primary,
      .btn-success,
      .btn-danger,
      .btn-outline {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-primary {
        background: var(--primary-color);
        color: var(--dark-bg);
      }

      .btn-primary:hover {
        background: #c19b2e;
        transform: translateY(-2px);
      }

      .btn-success {
        background: var(--success);
        color: white;
      }

      .btn-success:hover {
        background: #218838;
        transform: translateY(-2px);
      }

      .btn-success:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .btn-danger {
        background: var(--danger);
        color: white;
      }

      .btn-danger:hover {
        background: #c82333;
        transform: translateY(-2px);
      }

      .btn-outline {
        background: transparent;
        color: var(--text-dark);
        border: 2px solid #ddd;
      }

      .btn-outline:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      .btn-icon {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: transparent;
      }

      .btn-icon:hover {
        transform: translateY(-2px);
      }

      .btn-icon.btn-danger {
        background: rgba(220, 53, 69, 0.1);
        color: var(--danger);
      }

      .btn-icon.btn-danger:hover {
        background: var(--danger);
        color: white;
      }

      .btn-icon.btn-success {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
      }

      .btn-icon.btn-success:hover {
        background: var(--success);
        color: white;
      }

      /* Pending Section */
      .empty-message {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-light);
      }

      .empty-message i {
        font-size: 3rem;
        color: var(--success);
        margin-bottom: 15px;
      }

      .empty-message p {
        margin: 0;
        font-size: 1.1rem;
      }

      .pending-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
      }

      .pending-card {
        background: var(--card-bg);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        background: rgba(255, 193, 7, 0.1);
        padding: 15px;
        border-bottom: 1px solid rgba(255, 193, 7, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-header h4 {
        margin: 0;
        color: var(--text-dark);
      }

      .card-header .category {
        background: var(--warning);
        color: var(--text-dark);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .card-body {
        padding: 15px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: var(--text-light);
        font-size: 0.9rem;
      }

      .info-row i {
        color: var(--primary-color);
        width: 20px;
      }

      .card-actions {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .location-select {
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 0.9rem;
        width: 100%;
      }

      .location-select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .action-buttons {
        display: flex;
        gap: 10px;
      }

      /* Shops Section */
      .shops-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .shop-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 20px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto auto;
        gap: 15px;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .shop-card:hover {
        transform: translateY(-5px);
      }

      .shop-icon {
        grid-row: span 2;
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }

      .shop-icon.category-fashion {
        background: rgba(212, 175, 55, 0.1);
        color: var(--primary-color);
      }

      .shop-icon.category-electronics {
        background: rgba(23, 162, 184, 0.1);
        color: var(--info);
      }

      .shop-icon.category-food {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
      }

      .shop-info {
        grid-column: 2;
      }

      .shop-info h4 {
        margin: 0 0 5px;
        color: var(--text-dark);
      }

      .shop-info p {
        margin: 5px 0;
        font-size: 0.9rem;
        color: var(--text-light);
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .shop-info p i {
        width: 16px;
      }

      .shop-status {
        grid-column: 3;
        grid-row: 1;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .shop-status.active {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
      }

      .shop-status.suspended {
        background: rgba(220, 53, 69, 0.1);
        color: var(--danger);
      }

      .shop-actions {
        grid-column: 3;
        grid-row: 2;
        display: flex;
        gap: 5px;
        justify-self: end;
      }

      /* Users Section */
      .create-form {
        background: var(--card-bg);
        border-radius: 10px;
        margin-bottom: 30px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .form-header {
        background: var(--dark-bg);
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .form-header h4 {
        margin: 0;
      }

      .form-body {
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .form-body input,
      .form-body select {
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .form-body input:focus,
      .form-body select:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .form-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }

      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .user-card {
        background: var(--card-bg);
        border-radius: 10px;
        padding: 20px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto auto;
        gap: 15px;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .user-avatar {
        grid-row: span 2;
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }

      .user-avatar.role-admin {
        background: rgba(220, 53, 69, 0.1);
        color: var(--danger);
      }

      .user-avatar.role-shop {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
      }

      .user-avatar.role-buyer {
        background: rgba(212, 175, 55, 0.1);
        color: var(--primary-color);
      }

      .user-info {
        grid-column: 2;
      }

      .user-info h4 {
        margin: 0 0 5px;
        color: var(--text-dark);
      }

      .user-info p {
        margin: 3px 0;
        font-size: 0.9rem;
        color: var(--text-light);
      }

      .user-status {
        grid-column: 3;
        grid-row: 1;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .user-status.active {
        background: rgba(40, 167, 69, 0.1);
        color: var(--success);
      }

      .user-status.inactive {
        background: rgba(108, 117, 125, 0.1);
        color: #6c757d;
      }

      .user-actions {
        grid-column: 3;
        grid-row: 2;
        display: flex;
        gap: 5px;
        justify-self: end;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .fixed-menu {
          width: 100%;
          height: 60px;
          bottom: auto;
          display: flex;
          align-items: center;
          padding: 0 20px;
        }

        .fixed-menu:hover,
        .fixed-menu:not(.collapsed) {
          width: 100%;
        }

        .menu-header {
          padding: 0;
          border: none;
          flex: 1;
        }

        .menu-toggle {
          display: block;
        }

        .menu-nav {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--dark-bg);
          padding: 20px;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 999;
        }

        .menu-nav.collapsed {
          transform: translateX(0);
        }

        .main-content {
          margin-left: 0;
          margin-top: 60px;
          padding: 15px;
        }

        .stats-grid,
        .pending-list,
        .shops-grid,
        .users-grid {
          grid-template-columns: 1fr;
        }

        .section-header {
          flex-direction: column;
          gap: 15px;
          align-items: stretch;
        }

        .header-actions {
          flex-direction: column;
        }

        .search-input {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  currentSection = 'dashboard';
  menuCollapsed = false;
  showCreateForm = false;

  // Données
  pendingShops: any[] = [];
  activeShops: any[] = [];
  allUsers: any[] = [];
  activeShopsCount = 0;
  totalRevenue = 12500000;
  searchQuery = '';

  // Nouvel utilisateur
  newUser = {
    name: '',
    email: '',
    role: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Données de démonstration
    this.pendingShops = [
      {
        id: '1',
        name: 'Zara Collection',
        manager: 'Jean Dupont',
        email: 'zara@imperia.mg',
        phone: '034 00 000 00',
        category: 'fashion',
        requestDate: new Date('2024-01-20'),
        assignedLocation: '',
      },
      {
        id: '2',
        name: 'Electro Home',
        manager: 'Marie Martin',
        email: 'electro@imperia.mg',
        phone: '034 11 111 11',
        category: 'electronics',
        requestDate: new Date('2024-01-21'),
        assignedLocation: '',
      },
    ];

    this.activeShops = [
      {
        id: 'A1',
        name: 'Boutique Luxe',
        manager: 'Pierre Durand',
        email: 'luxe@imperia.mg',
        category: 'fashion',
        location: 'Niveau 1',
        status: 'active',
        revenue: 2500000,
      },
      {
        id: 'A2',
        name: 'Tech Store',
        manager: 'Sophie Bernard',
        email: 'tech@imperia.mg',
        category: 'electronics',
        location: 'Niveau 2',
        status: 'active',
        revenue: 1800000,
      },
      {
        id: 'A3',
        name: 'Le Gourmet',
        manager: 'Robert Petit',
        email: 'gourmet@imperia.mg',
        category: 'food',
        location: 'Food Court',
        status: 'suspended',
        revenue: 1200000,
      },
    ];

    this.allUsers = [
      {
        id: 'U1',
        name: 'Admin Principal',
        email: 'admin@imperia.mg',
        role: 'admin',
        active: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'U2',
        name: 'Boutique Zara',
        email: 'zara@imperia.mg',
        role: 'shop',
        active: true,
        createdAt: new Date('2024-01-05'),
      },
      {
        id: 'U3',
        name: 'Client VIP',
        email: 'client@imperia.mg',
        role: 'buyer',
        active: true,
        createdAt: new Date('2024-01-10'),
      },
    ];

    this.activeShopsCount = this.activeShops.filter(
      (s) => s.status === 'active',
    ).length;
  }

  toggleMenu() {
    this.menuCollapsed = !this.menuCollapsed;
  }

  selectSection(section: string) {
    this.currentSection = section;
    // Sur mobile, ferme le menu après sélection
    if (window.innerWidth < 768) {
      this.menuCollapsed = true;
    }
  }

  // Méthodes utilitaires
  formatNumber(num: number): string {
    return num.toLocaleString('fr-MG');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-MG');
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      fashion: 'fas fa-tshirt',
      electronics: 'fas fa-laptop',
      food: 'fas fa-utensils',
    };
    return icons[category] || 'fas fa-store';
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      fashion: 'Mode',
      electronics: 'Électronique',
      food: 'Restauration',
    };
    return labels[category] || category;
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      admin: 'fas fa-user-shield',
      shop: 'fas fa-store',
      buyer: 'fas fa-user',
    };
    return icons[role] || 'fas fa-user';
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      admin: 'Administrateur',
      shop: 'Gérant boutique',
      buyer: 'Client',
    };
    return labels[role] || role;
  }

  // Méthodes de gestion
  approveShop(shop: any) {
    if (!shop.assignedLocation) {
      alert('Veuillez sélectionner un emplacement');
      return;
    }

    this.pendingShops = this.pendingShops.filter((s) => s.id !== shop.id);

    const newShop = {
      ...shop,
      status: 'active',
      location: shop.assignedLocation,
      revenue: Math.floor(Math.random() * 2000000) + 500000,
    };

    this.activeShops.unshift(newShop);
    this.activeShopsCount = this.activeShops.filter(
      (s) => s.status === 'active',
    ).length;

    alert(`Boutique "${shop.name}" validée avec succès !`);
  }

  rejectShop(shop: any) {
    if (confirm(`Refuser la demande de "${shop.name}" ?`)) {
      this.pendingShops = this.pendingShops.filter((s) => s.id !== shop.id);
      alert('Demande refusée');
    }
  }

  getFilteredShops() {
    if (!this.searchQuery) return this.activeShops;

    const query = this.searchQuery.toLowerCase();
    return this.activeShops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(query) ||
        shop.manager.toLowerCase().includes(query) ||
        shop.email.toLowerCase().includes(query),
    );
  }

  viewShop(shop: any) {
    alert(
      `Boutique: ${shop.name}\nGérant: ${shop.manager}\nEmail: ${shop.email}\nCA: ${this.formatNumber(shop.revenue)} MGA/mois`,
    );
  }

  editShop(shop: any) {
    const newLocation = prompt('Nouvel emplacement:', shop.location);
    if (newLocation) {
      shop.location = newLocation;
      alert('Emplacement modifié');
    }
  }

  toggleShopStatus(shop: any) {
    shop.status = shop.status === 'active' ? 'suspended' : 'active';
    this.activeShopsCount = this.activeShops.filter(
      (s) => s.status === 'active',
    ).length;
    alert(`Statut modifié: ${shop.status === 'active' ? 'ACTIF' : 'SUSPENDU'}`);
  }

  addShop() {
    alert("Fonctionnalité d'ajout de boutique - À implémenter");
  }

  createUser() {
    if (
      !this.newUser.name ||
      !this.newUser.email ||
      !this.newUser.role ||
      !this.newUser.password
    ) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newUser = {
      id: 'U' + Date.now().toString().slice(-6),
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role,
      active: true,
      createdAt: new Date(),
    };

    this.allUsers.unshift(newUser);
    this.newUser = { name: '', email: '', role: '', password: '' };
    this.showCreateForm = false;
    alert('Utilisateur créé avec succès');
  }

  resetPassword(user: any) {
    alert(`Réinitialisation du mot de passe pour ${user.name}`);
  }

  toggleUserStatus(user: any) {
    user.active = !user.active;
    alert(`Utilisateur ${user.active ? 'activé' : 'désactivé'}`);
  }

  logout() {
    if (confirm('Déconnexion ?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
