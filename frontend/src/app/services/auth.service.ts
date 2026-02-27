import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { tap, Observable, of, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signal pour stocker l'utilisateur connecté
  currentUserSig = signal<User | null>(null);

  constructor() {
    // Dès que l'application démarre/refresh, on tente de restaurer la session
    this.restoreSession();
  }

  /**
   * Tente de récupérer les infos de l'utilisateur si un token est présent
   */
  private restoreSession(): void {
    const token = localStorage.getItem('token');
    
    if (token) {
      // On appelle une route "profile" ou "me" pour récupérer l'utilisateur via le token
      // Ton intercepteur ajoutera automatiquement le Bearer Token à cette requête
      this.http.get<User>(`${this.apiUrl}/users/profile`).subscribe({
        next: (user) => {
          console.log('Session restaurée avec succès:', user);
          this.currentUserSig.set(user);
        },
        error: (err) => {
          console.error('Session expirée ou token invalide', err);
          this.logout(); // On nettoie tout si le token n'est plus bon
        }
      });
    }
  }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/users/login`, payload).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.currentUserSig.set(res.user);
      })
    );
  }

  register(userData: any): Observable<any> {
    const payload = {
      email: userData.email,
      password: userData.password,
      name: userData.fullName,
      role: userData.role,
      phone: userData.phone,
      address: userData.address,
    };

    return this.http.post<any>(`${this.apiUrl}/users/signup`, payload).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.currentUserSig.set(res.user);
        }
      })
    );
  }

  // --- Méthodes utilitaires ---

  getUserRole(): string {
    return this.currentUserSig()?.role || '';
  }

  logout(): void {
    this.currentUserSig.set(null);
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    // On vérifie si on a un utilisateur DANS le signal
    // OU si on a un token (pendant que le signal est en train d'être chargé)
    return !!this.currentUserSig() || !!localStorage.getItem('token');
  }

  // --- Gestion des utilisateurs (Admin) ---

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  toggleStatus(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/toggle-status`, {});
  }

  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/create-user`, userData);
  }
}