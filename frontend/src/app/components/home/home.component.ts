import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Hero Section Luxe -->
      <section class="hero-section">
        <div class="hero-background">
          <div class="hero-gradient"></div>
          <div class="hero-pattern"></div>
        </div>
        <div class="container hero-content">
          <div class="hero-logo">
            <div class="logo-typography">IMPERIA</div>
            <div class="logo-subtitle">Shopping Center</div>
          </div>

          <h1 class="hero-title">
            <span class="title-line">L'ART DU</span>
            <span class="title-line accent">SHOPPING</span>
            <span class="title-line">EXCEPTIONNEL</span>
          </h1>

          <p class="hero-description">
            Antananarivo's premier luxury retail destination — where
            sophistication meets curated elegance
          </p>

          <div class="hero-search">
            <div class="search-container">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                class="search-input"
                placeholder="Rechercher des produits, marques ou boutiques..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="search()"
              />
              <button class="search-btn" (click)="search()">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <div class="hero-actions">
            <button class="btn-luxe btn-primary" routerLink="/buyer">
              <span class="btn-content">
                <i class="fas fa-gem"></i>
                <span>EXPLORER LES BOUTIQUES</span>
              </span>
            </button>
            <button class="btn-luxe btn-secondary" routerLink="/login">
              <span class="btn-content">
                <i class="fas fa-crown"></i>
                <span>ESPACE PRIVILÈGE</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- Carte Interactive Luxe -->
      <section class="map-section-luxe">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">PLAN ARCHITECTURAL</h2>
            <p class="section-subtitle">
              Découvrez l'agencement exclusif de nos boutiques
            </p>
          </div>

          <div class="map-luxe-container">
            <div class="map-visual">
              <div class="map-level">
                <h4 class="level-title">
                  LEVEL <span class="accent">ONE</span>
                </h4>
                <div class="level-shops">
                  <div
                    class="shop-pin luxury"
                    (click)="selectShop('Zara')"
                    [class.active]="selectedShop === 'Zara'"
                  >
                    <div class="pin-marker"></div>
                    <div class="pin-label">ZARA</div>
                    <div class="pin-category">Haute Couture</div>
                  </div>
                  <div
                    class="shop-pin fashion"
                    (click)="selectShop('LC Waikiki')"
                    [class.active]="selectedShop === 'LC Waikiki'"
                  >
                    <div class="pin-marker"></div>
                    <div class="pin-label">LC WAIKIKI</div>
                    <div class="pin-category">Prêt-à-porter</div>
                  </div>
                  <div
                    class="shop-pin tech"
                    (click)="selectShop('Star')"
                    [class.active]="selectedShop === 'Star'"
                  >
                    <div class="pin-marker"></div>
                    <div class="pin-label">STAR</div>
                    <div class="pin-category">Technologie</div>
                  </div>
                </div>
              </div>

              <div class="map-divider"></div>

              <div class="map-level">
                <h4 class="level-title">
                  LEVEL <span class="accent">TWO</span>
                </h4>
                <div class="level-shops">
                  <div
                    class="shop-pin dining"
                    (click)="selectShop('Jumbo Score')"
                    [class.active]="selectedShop === 'Jumbo Score'"
                  >
                    <div class="pin-marker"></div>
                    <div class="pin-label">JUMBO SCORE</div>
                    <div class="pin-category">Restaurant Étoilé</div>
                  </div>
                  <div
                    class="shop-pin telecom"
                    (click)="selectShop('Orange')"
                    [class.active]="selectedShop === 'Orange'"
                  >
                    <div class="pin-marker"></div>
                    <div class="pin-label">ORANGE</div>
                    <div class="pin-category">Connectivité</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="map-sidebar">
              <div class="sidebar-header">
                <h3>EXPLORER</h3>
                <div class="sidebar-line"></div>
              </div>

              <div class="legend-luxe">
                <div class="legend-item">
                  <div class="legend-color luxury"></div>
                  <span>LUXURY BOUTIQUES</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color fashion"></div>
                  <span>FASHION HOUSES</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color tech"></div>
                  <span>TECHNOLOGY</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color dining"></div>
                  <span>FINE DINING</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color telecom"></div>
                  <span>CONNECTIVITY</span>
                </div>
              </div>

              <div class="selected-shop-luxe" *ngIf="selectedShop">
                <div class="selected-header">
                  <i class="fas fa-store-alt"></i>
                  <h4>BOUTIQUE SÉLECTIONNÉE</h4>
                </div>
                <div class="selected-content">
                  <h3 class="shop-name">{{ selectedShop }}</h3>
                  <p class="shop-category">
                    {{ getShopCategory(selectedShop) }}
                  </p>
                  <p class="shop-description">
                    Boutique exclusive proposant les dernières collections dans
                    un cadre raffiné et personnalisé.
                  </p>
                  <button
                    class="btn-luxe btn-view"
                    (click)="viewShopProducts(selectedShop)"
                  >
                    VISITER LA BOUTIQUE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Collection Exclusive -->
      <section class="collection-section">
        <div class="container">
          <div class="collection-header">
            <div>
              <h2 class="section-title">COLLECTION EXCLUSIVE</h2>
              <p class="section-subtitle">Pièces sélectionnées avec exigence</p>
            </div>
            <button class="view-all" routerLink="/buyer">
              VOIR LA COLLECTION
              <i class="fas fa-arrow-right-long"></i>
            </button>
          </div>

          <div class="products-grid">
            <div
              class="product-card-luxe"
              *ngFor="let product of featuredProducts"
            >
              <div class="product-image-container">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="product-image"
                />
                <div class="product-badge">NOUVEAU</div>
                <div class="product-overlay">
                  <button
                    class="add-to-cart-btn"
                    (click)="addToCart(product)"
                    [disabled]="product.stock === 0"
                  >
                    <i class="fas fa-shopping-bag"></i>
                  </button>
                </div>
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <p class="product-brand">{{ product.shopName }}</p>
                <div class="product-footer">
                  <span class="product-price"
                    >{{ formatNumber(product.price) }} MGA</span
                  >
                  <span
                    class="product-stock"
                    [ngClass]="{
                      high: product.stock > 20,
                      low: product.stock <= 20 && product.stock > 5,
                      critical: product.stock <= 5,
                    }"
                  >
                    {{ product.stock }} DISPONIBLES
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="info-section-luxe">
        <div class="container">
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-clock"></i>
              </div>
              <h4>HORAIRES EXCLUSIFS</h4>
              <p>
                <strong>MEMBERS ONLY:</strong> 8h - 22h<br />
                <strong>PUBLIC:</strong> 9h - 21h<br />
                <strong>DIMANCHE:</strong> 10h - 19h
              </p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h4>SITUATION PRIVILÉGIÉE</h4>
              <p>
                Ivandry, Antananarivo<br />
                Valet parking & conciergerie<br />
                Espace VIP avec chauffeur
              </p>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h4>SERVICE PERSONNALISÉ</h4>
              <p>
                <strong>CONCIERGERIE:</strong> 24h/24<br />
                <strong>PERSONAL SHOPPER:</strong> Sur rendez-vous<br />
                <strong>ASSISTANCE VIP:</strong> +261 34 00 000 00
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');

      :host {
        --primary-gold: #d4af37;
        --dark-charcoal: #1a1a1a;
        --light-cream: #f5f3ef;
        --accent-burgundy: #8b0000;
        --metal-gray: #5d5d5d;
        --success-emerald: #2e8b57;
        --font-heading: 'Playfair Display', serif;
        --font-body: 'Inter', sans-serif;
      }

      .home-container {
        font-family: var(--font-body);
        color: var(--dark-charcoal);
        background: var(--light-cream);
      }

      /* Hero Section */
      .hero-section {
        position: relative;
        min-height: 90vh;
        display: flex;
        align-items: center;
        overflow: hidden;
      }

      .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          var(--dark-charcoal) 0%,
          #2a2a2a 100%
        );
      }

      .hero-gradient {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle at 20% 50%,
          rgba(212, 175, 55, 0.1) 0%,
          transparent 50%
        );
      }

      .hero-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4AF37' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
      }

      .hero-content {
        position: relative;
        z-index: 2;
        color: white;
        text-align: center;
        padding: 4rem 0;
      }

      .hero-logo {
        margin-bottom: 3rem;
      }

      .logo-typography {
        font-family: var(--font-heading);
        font-size: 4rem;
        font-weight: 900;
        letter-spacing: 0.5rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
        background: linear-gradient(to right, #d4af37, #f4e4a6);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 2px 20px rgba(212, 175, 55, 0.3);
      }

      .logo-subtitle {
        font-family: var(--font-body);
        font-weight: 300;
        letter-spacing: 0.3rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        opacity: 0.8;
      }

      .hero-title {
        font-family: var(--font-heading);
        font-size: 4rem;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      .title-line {
        display: block;
      }

      .title-line.accent {
        color: var(--primary-gold);
        position: relative;
        display: inline-block;
      }

      .title-line.accent::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 2px;
        background: var(--primary-gold);
      }

      .hero-description {
        font-size: 1.2rem;
        max-width: 600px;
        margin: 0 auto 3rem;
        line-height: 1.6;
        opacity: 0.9;
      }

      .hero-search {
        max-width: 600px;
        margin: 0 auto 3rem;
      }

      .search-container {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 50px;
        padding: 0.5rem 1.5rem;
        transition: all 0.3s ease;
      }

      .search-container:focus-within {
        border-color: var(--primary-gold);
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
      }

      .search-icon {
        color: var(--primary-gold);
        margin-right: 1rem;
      }

      .search-input {
        flex: 1;
        background: transparent;
        border: none;
        color: white;
        font-size: 1rem;
        padding: 1rem 0;
        outline: none;
      }

      .search-input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      .search-btn {
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .search-btn:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
      }

      .hero-actions {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
      }

      .btn-luxe {
        padding: 1.2rem 2.5rem;
        border: none;
        font-family: var(--font-body);
        font-weight: 600;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .btn-luxe::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        transition: 0.5s;
      }

      .btn-luxe:hover::before {
        left: 100%;
      }

      .btn-primary {
        background: var(--primary-gold);
        color: var(--dark-charcoal);
      }

      .btn-secondary {
        background: transparent;
        color: white;
        border: 2px solid var(--primary-gold);
      }

      .btn-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-size: 0.9rem;
      }

      /* Map Section */
      .map-section-luxe {
        padding: 6rem 0;
        background: white;
      }

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-title {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.2rem;
        margin-bottom: 1rem;
        position: relative;
        display: inline-block;
      }

      .section-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 2px;
        background: var(--primary-gold);
      }

      .section-subtitle {
        color: var(--metal-gray);
        font-size: 1.1rem;
      }

      .map-luxe-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
        background: var(--light-cream);
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      }

      .map-visual {
        position: relative;
      }

      .map-level {
        margin-bottom: 3rem;
      }

      .level-title {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        margin-bottom: 2rem;
        color: var(--dark-charcoal);
      }

      .level-title .accent {
        color: var(--primary-gold);
      }

      .level-shops {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
      }

      .shop-pin {
        flex: 1;
        min-width: 200px;
        padding: 1.5rem;
        background: white;
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        border: 2px solid transparent;
      }

      .shop-pin::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
      }

      .shop-pin.luxury::before {
        background: var(--primary-gold);
      }
      .shop-pin.fashion::before {
        background: var(--accent-burgundy);
      }
      .shop-pin.tech::before {
        background: #1e90ff;
      }
      .shop-pin.dining::before {
        background: var(--success-emerald);
      }
      .shop-pin.telecom::before {
        background: #ff8c00;
      }

      .shop-pin:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }

      .shop-pin.active {
        border-color: var(--dark-charcoal);
      }

      .pin-marker {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-bottom: 1rem;
      }

      .shop-pin.luxury .pin-marker {
        background: var(--primary-gold);
      }
      .shop-pin.fashion .pin-marker {
        background: var(--accent-burgundy);
      }
      .shop-pin.tech .pin-marker {
        background: #1e90ff;
      }
      .shop-pin.dining .pin-marker {
        background: var(--success-emerald);
      }
      .shop-pin.telecom .pin-marker {
        background: #ff8c00;
      }

      .pin-label {
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        letter-spacing: 0.1rem;
      }

      .pin-category {
        color: var(--metal-gray);
        font-size: 0.9rem;
      }

      .map-divider {
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          var(--metal-gray),
          transparent
        );
        margin: 3rem 0;
      }

      /* Sidebar */
      .map-sidebar {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }

      .sidebar-header {
        margin-bottom: 2rem;
      }

      .sidebar-header h3 {
        font-family: var(--font-heading);
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .sidebar-line {
        height: 2px;
        width: 60px;
        background: var(--primary-gold);
      }

      .legend-luxe {
        margin-bottom: 2rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 5px;
        transition: background 0.3s ease;
      }

      .legend-item:hover {
        background: var(--light-cream);
      }

      .legend-color {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }

      .legend-color.luxury {
        background: var(--primary-gold);
      }
      .legend-color.fashion {
        background: var(--accent-burgundy);
      }
      .legend-color.tech {
        background: #1e90ff;
      }
      .legend-color.dining {
        background: var(--success-emerald);
      }
      .legend-color.telecom {
        background: #ff8c00;
      }

      .selected-shop-luxe {
        background: linear-gradient(
          135deg,
          var(--dark-charcoal) 0%,
          #2a2a2a 100%
        );
        color: white;
        padding: 2rem;
        border-radius: 15px;
        margin-top: 2rem;
      }

      .selected-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        color: var(--primary-gold);
      }

      .selected-header i {
        font-size: 1.5rem;
      }

      .selected-header h4 {
        font-family: var(--font-body);
        font-size: 0.9rem;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        opacity: 0.8;
      }

      .shop-name {
        font-family: var(--font-heading);
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }

      .shop-category {
        color: var(--primary-gold);
        font-size: 1rem;
        margin-bottom: 1rem;
      }

      .shop-description {
        opacity: 0.8;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }

      .btn-view {
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        width: 100%;
        padding: 1rem;
        border-radius: 10px;
      }

      /* Collection Section */
      .collection-section {
        padding: 6rem 0;
        background: var(--light-cream);
      }

      .collection-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4rem;
      }

      .view-all {
        background: none;
        border: none;
        color: var(--dark-charcoal);
        font-family: var(--font-body);
        font-weight: 600;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .view-all:hover {
        color: var(--primary-gold);
        gap: 1.5rem;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .product-card-luxe {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }

      .product-card-luxe:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .product-image-container {
        position: relative;
        height: 300px;
        overflow: hidden;
      }

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .product-card-luxe:hover .product-image {
        transform: scale(1.05);
      }

      .product-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.1rem;
      }

      .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(26, 26, 26, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .product-card-luxe:hover .product-overlay {
        opacity: 1;
      }

      .add-to-cart-btn {
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .add-to-cart-btn:hover:not(:disabled) {
        transform: scale(1.1);
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
      }

      .add-to-cart-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .product-info {
        padding: 1.5rem;
      }

      .product-name {
        font-family: var(--font-heading);
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
      }

      .product-brand {
        color: var(--metal-gray);
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .product-price {
        font-weight: 600;
        font-size: 1.2rem;
        color: var(--dark-charcoal);
      }

      .product-stock {
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
      }

      .product-stock.high {
        background: rgba(46, 139, 87, 0.1);
        color: var(--success-emerald);
      }

      .product-stock.low {
        background: rgba(255, 140, 0, 0.1);
        color: #ff8c00;
      }

      .product-stock.critical {
        background: rgba(139, 0, 0, 0.1);
        color: var(--accent-burgundy);
      }

      /* Events Section */
      .events-section {
        padding: 6rem 0;
        background: linear-gradient(
          135deg,
          var(--dark-charcoal) 0%,
          #2a2a2a 100%
        );
        color: white;
      }

      .event-card {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }

      .event-badge {
        display: inline-block;
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        padding: 0.5rem 1.5rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.1rem;
        margin-bottom: 2rem;
      }

      .event-title {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      .event-description {
        max-width: 600px;
        margin: 0 auto 3rem;
        font-size: 1.1rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .event-countdown {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .countdown-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .countdown-value {
        font-family: var(--font-heading);
        font-size: 3rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 10px;
        min-width: 80px;
      }

      .countdown-label {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        opacity: 0.8;
        letter-spacing: 0.1rem;
      }

      .countdown-separator {
        font-size: 2rem;
        opacity: 0.5;
        margin-top: -1rem;
      }

      .btn-event {
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        padding: 1.2rem 3rem;
        border-radius: 50px;
      }

      /* Info Section */
      .info-section-luxe {
        padding: 6rem 0;
        background: white;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .info-card {
        text-align: center;
        padding: 2.5rem;
        border-radius: 20px;
        background: var(--light-cream);
        transition: all 0.3s ease;
      }

      .info-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .info-icon {
        width: 70px;
        height: 70px;
        background: var(--primary-gold);
        color: var(--dark-charcoal);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        font-size: 1.8rem;
      }

      .info-card h4 {
        font-family: var(--font-heading);
        font-size: 1.3rem;
        margin-bottom: 1rem;
      }

      .info-card p {
        color: var(--metal-gray);
        line-height: 1.6;
      }

      /* Responsive */
      @media (max-width: 992px) {
        .map-luxe-container {
          grid-template-columns: 1fr;
        }

        .hero-title {
          font-size: 3rem;
        }

        .logo-typography {
          font-size: 3rem;
        }

        .collection-header {
          flex-direction: column;
          gap: 2rem;
          text-align: center;
        }
      }

      @media (max-width: 768px) {
        .hero-actions {
          flex-direction: column;
          gap: 1rem;
        }

        .level-shops {
          flex-direction: column;
        }

        .event-title {
          font-size: 2rem;
        }

        .event-countdown {
          flex-wrap: wrap;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  selectedShop: string | null = null;

  featuredProducts: Product[] = [];
  shops = [
    { name: 'Zara', category: 'fashion', location: 'Aile Nord, RDC' },
    { name: 'LC Waikiki', category: 'fashion', location: 'Aile Nord, RDC' },
    { name: 'Star', category: 'electronics', location: 'Aile Est, RDC' },
    { name: 'Jumbo Score', category: 'food', location: 'Food Court, Étage' },
    { name: 'Orange', category: 'telecom', location: 'Aile Ouest, RDC' },
  ];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Ici, 'products' est bien un tableau (Array), donc .slice() fonctionne !
        this.featuredProducts = products.slice(0, 3);
      },
      error: (err) => console.error('Erreur de chargement', err),
    });
  }

  search() {
    if (this.searchQuery.trim()) {
      alert(`Recherche pour: ${this.searchQuery}`);
    }
  }

  selectShop(shopName: string) {
    this.selectedShop = shopName;
  }

  getShopCategory(shopName: string): string {
    const shop = this.shops.find((s) => s.name === shopName);
    if (!shop) return 'Boutique';

    const categories: { [key: string]: string } = {
      fashion: 'Maison de Mode',
      electronics: 'Technologie Avancée',
      food: 'Restaurant Étoilé',
      telecom: 'Connectivité Premium',
    };
    return categories[shop.category] || 'Boutique Exclusive';
  }

  viewShopProducts(shopName: string) {
    alert(`Redirection vers les produits de ${shopName}`);
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      alert('Veuillez vous connecter pour ajouter des produits au panier');
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      shopId: product.shopId,
      shopName: product.shopName,
    };

    this.cartService.addToCart(cartItem);
    alert(
      `${product.name} ajouté au panier pour ${this.formatNumber(product.price)} Ar!`,
    );
  }

  formatNumber(num: number): string {
    return num.toLocaleString('fr-MG');
  }

  viewPromotions() {
    alert('Page des promotions - En développement');
  }
}
