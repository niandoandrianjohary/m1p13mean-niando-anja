import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Ton fameux Signal pour stocker l'utilisateur connecté
  currentUserSig = signal<User | null>(null);

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    console.log('AuthService.login: payload =', payload);
    return this.http.post<any>(`${this.apiUrl}/users/login`, payload).pipe(
      tap(res => {
        // On stocke l'utilisateur dans le signal et le token dans le localStorage
        this.currentUserSig.set(res.user);
        localStorage.setItem('token', res.token);
      })
    );
  }

  getUserRole(): string {
    return this.currentUserSig()?.role || '';
  }

  logout(): void {
    this.currentUserSig.set(null);
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSig();
  }
}

// import { Injectable, signal } from '@angular/core';
// import { Router } from '@angular/router';
// import { DEMO_USERS } from '../data/demo-data';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUser = signal<User | null>(null);
//   currentUserSig = this.currentUser.asReadonly();

//   constructor(private router: Router) {
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       this.currentUser.set(JSON.parse(savedUser));
//     }
//   }

//   login(email: string, password: string): boolean {
//     const user = DEMO_USERS.find(u =>
//       u.email === email && u.password === password
//     );

//     if (user) {
//       const { password: _, ...userWithoutPassword } = user;
//       this.currentUser.set(userWithoutPassword as User);
//       localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
//       return true;
//     }

//     return false;
//   }

//   register(userData: any): boolean {
//     const newUser: User = {
//       id: (DEMO_USERS.length + 1).toString(),
//       ...userData
//     };

//     // En vrai, on ajouterait à la base de données
//     // Pour la démo, on simule l'enregistrement
//     this.currentUser.set(newUser);
//     localStorage.setItem('currentUser', JSON.stringify(newUser));
//     return true;
//   }

//   logout(): void {
//     this.currentUser.set(null);
//     localStorage.removeItem('currentUser');
//     this.router.navigate(['/login']);
//   }

//   isLoggedIn(): boolean {
//     return this.currentUser() !== null;
//   }

//   getUserRole(): string | null {
//     return this.currentUser()?.role || null;
//   }
// }


