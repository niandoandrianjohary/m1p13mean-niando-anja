import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header-luxe">
      <div class="header-top">
        <div class="container">
          <div class="header-contact">
            <span class="contact-item">
              <i class="fas fa-phone"></i> +261 34 00 000 00
            </span>
            <span class="contact-item">
              <i class="fas fa-clock"></i> Ouvert 7j/7
            </span>
            <span class="contact-item">
              <i class="fas fa-map-marker-alt"></i> Ivandry, Antananarivo
            </span>
          </div>

          <div class="header-utils">
            <a href="#" class="utils-link">Personal Shopper</a>
            <a href="#" class="utils-link">Événements</a>
          </div>
        </div>
      </div>

      <nav class="header-main">
        <div class="container">
          <div class="header-logo">
            <div class="logo-mark">I</div>
            <div class="logo-text">
              <div class="logo-primary">IMPERIA</div>
              <div class="logo-sub">Shopping Center</div>
            </div>
          </div>

          <div class="header-nav">
            <a routerLink="/" class="nav-link" routerLinkActive="active">
              ACCUEIL
            </a>
            <a *ngIf="isLoggedIn()" [routerLink]="getDashboardLink()" class="nav-link" routerLinkActive="active">
              DASHBOARD
            </a>
            <a href="#" class="nav-link">BOUTIQUES</a>
            <a href="#" class="nav-link">CONTACT</a>
          </div>

          <div class="header-actions">
            <button class="action-btn search-btn">
              <i class="fas fa-search"></i>
            </button>

            <div class="cart-container" *ngIf="isBuyer()">
              <button class="action-btn cart-btn" routerLink="/buyer/cart">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-count" *ngIf="cartService.itemCount() > 0">
                  {{ cartService.itemCount() }}
                </span>
              </button>
            </div>

            <div class="user-menu">
              <div *ngIf="isLoggedIn(); else loginButtons">
                <div class="user-dropdown">
                  <button class="user-btn">
                    <i class="fas fa-user-circle"></i>
                    <span class="user-name">{{ getUserName() }}</span>
                    <i class="fas fa-chevron-down"></i>
                  </button>
                  <div class="dropdown-content">
                    <a [routerLink]="getDashboardLink()" class="dropdown-item">
                      <i class="fas fa-tachometer-alt"></i> Tableau de bord
                    </a>
                    <a href="#" class="dropdown-item">
                      <i class="fas fa-heart"></i> Favoris
                    </a>
                    <a href="#" class="dropdown-item">
                      <i class="fas fa-history"></i> Historique
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item logout" (click)="logout()">
                      <i class="fas fa-sign-out-alt"></i> Déconnexion
                    </a>
                  </div>
                </div>
              </div>

              <ng-template #loginButtons>
                <button class="btn-login" routerLink="/login">
                  <i class="fas fa-user"></i>
                  <span>CONNEXION</span>
                </button>
              </ng-template>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');

    :host {
      --primary-gold: #D4AF37;
      --dark-charcoal: #1A1A1A;
      --light-cream: #F5F3EF;
      --accent-burgundy: #8B0000;
      --metal-gray: #5D5D5D;
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Inter', sans-serif;
    }

      .header-luxe {
      font-family: var(--font-body);
      position: fixed; /* Force le blocage en haut de l'écran */
      top: 0;
      left: 0;
      width: 100%;    /* Indispensable car fixed sort l'élément du flux */
      z-index: 1050;  /* Plus haut que tout le reste */
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      }

    .header-top {
      background: var(--dark-charcoal);
      color: white;
      padding: 0.5rem 0;
      font-size: 0.85rem;
    }

    .header-top .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-contact {
      display: flex;
      gap: 2rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }

    .contact-item:hover {
      opacity: 1;
    }

    .contact-item i {
      color: var(--primary-gold);
    }

    .header-utils {
      display: flex;
      gap: 1.5rem;
    }

    .utils-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      letter-spacing: 0.05rem;
      position: relative;
      padding: 0.2rem 0;
    }

    .utils-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--primary-gold);
      transition: width 0.3s ease;
    }

    .utils-link:hover::after {
      width: 100%;
    }

    .header-main {
      background: white;
      padding: 1rem 0;
    }

    .header-main .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
    }

    .logo-mark {
      width: 50px;
      height: 50px;
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 900;
    }

    .logo-text {
      line-height: 1;
    }

    .logo-primary {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: 0.1rem;
      color: var(--dark-charcoal);
    }

    .logo-sub {
      font-size: 0.7rem;
      letter-spacing: 0.1rem;
      color: var(--metal-gray);
      text-transform: uppercase;
    }

    .header-nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: var(--dark-charcoal);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
      padding: 0.5rem 0;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--primary-gold);
      transition: width 0.3s ease;
    }

    .nav-link:hover::after,
    .nav-link.active::after {
      width: 100%;
    }

    .nav-link:hover,
    .nav-link.active {
      color: var(--primary-gold);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .action-btn {
      background: none;
      border: none;
      color: var(--dark-charcoal);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      position: relative;
      transition: color 0.3s ease;
    }

    .action-btn:hover {
      color: var(--primary-gold);
    }

    .cart-container {
      position: relative;
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--accent-burgundy);
      color: white;
      font-size: 0.7rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .user-menu {
      position: relative;
    }

    .user-dropdown {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background: none;
      border: 1px solid var(--metal-gray);
      padding: 0.5rem 1rem;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-btn:hover {
      border-color: var(--primary-gold);
      color: var(--primary-gold);
    }

    .user-btn i {
      font-size: 1.2rem;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .dropdown-content {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      min-width: 220px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border-radius: 10px;
      padding: 0.5rem 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
    }

    .user-dropdown:hover .dropdown-content {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1.5rem;
      color: var(--dark-charcoal);
      text-decoration: none;
      transition: background 0.3s ease;
    }

    .dropdown-item:hover {
      background: var(--light-cream);
    }

    .dropdown-item i {
      width: 20px;
      color: var(--primary-gold);
    }

    .dropdown-divider {
      height: 1px;
      background: var(--light-cream);
      margin: 0.5rem 0;
    }

    .logout {
      color: var(--accent-burgundy);
    }

    .logout i {
      color: var(--accent-burgundy);
    }

    .btn-login {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.05rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .header-nav {
        gap: 1rem;
      }

      .nav-link {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 992px) {
      .header-top {
        display: none;
      }

      .header-nav {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isBuyer(): boolean {
    return this.authService.getUserRole() === 'buyer';
  }

  getUserName(): string {
    const user = this.authService.currentUserSig();
    return user?.name || 'Utilisateur';
  }

  getDashboardLink(): string {
    const role = this.authService.getUserRole();
    switch(role) {
      case 'admin': return '/admin';
      case 'shop': return '/shop';
      case 'buyer': return '/buy';
      default: return '/';
    }
  }

  logout() {
    this.authService.logout();
  }
}
