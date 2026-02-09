import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DEMO_USERS } from '../data/demo-data';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  currentUserSig = this.currentUser.asReadonly();

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): boolean {
    const user = DEMO_USERS.find(u =>
      u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  }

  register(userData: any): boolean {
    const newUser: User = {
      id: (DEMO_USERS.length + 1).toString(),
      ...userData
    };

    // En vrai, on ajouterait à la base de données
    // Pour la démo, on simule l'enregistrement
    this.currentUser.set(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getUserRole(): string | null {
    return this.currentUser()?.role || null;
  }
}
