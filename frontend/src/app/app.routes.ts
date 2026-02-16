// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },

  // Authentification
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
   {
    path: 'register',  // ← AJOUTEZ CETTE ROUTE
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Acheteur
  {
    path: 'buy',
    loadComponent: () => import('./components/dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent)
  },

  // Tableau de bord Boutique
  {
    path: 'shop',
    loadComponent: () => import('./components/dashboard/shop-dashboard.component').then(m => m.ShopDashboardComponent)
  },

  // Tableau de bord Admin
  {
    path: 'admin',
    loadComponent: () => import('./components/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },

  // Redirection 404
  {
    path: '**',
    redirectTo: ''
  }
];
