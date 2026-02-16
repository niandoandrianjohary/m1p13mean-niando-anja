import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ShopService } from '../../../services/shop.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="login-gradient"></div>
        <div class="login-pattern"></div>
      </div>

      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-header">
            <div class="logo-wrapper">
              <div class="logo-mark">I</div>
              <div class="logo-text">
                <div class="logo-primary">IMPERIA</div>
                <div class="logo-sub">Espace Privilège</div>
              </div>
            </div>
            <h1 class="login-title">ACCÈS EXCLUSIF</h1>
            <p class="login-subtitle">Accédez à votre espace personnel</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group-luxe">
              <label for="email" class="form-label">
                <i class="fas fa-envelope"></i>
                ADRESSE EMAIL
              </label>
              <div class="input-container">
                <input type="email"
                       id="email"
                       class="form-input-luxe"
                       [(ngModel)]="email"
                       name="email"
                       required
                       placeholder="exemple@imperia.mg">
                <div class="input-border"></div>
              </div>
            </div>

            <div class="form-group-luxe">
              <label for="password" class="form-label">
                <i class="fas fa-lock"></i>
                MOT DE PASSE
              </label>
              <div class="input-container">
                <input [type]="showPassword ? 'text' : 'password'"
                       id="password"
                       class="form-input-luxe"
                       [(ngModel)]="password"
                       name="password"
                       required
                       placeholder="••••••••">
                <button type="button"
                        class="password-toggle"
                        (click)="showPassword = !showPassword">
                  <i class="fas" [class.fa-eye]="!showPassword"
                     [class.fa-eye-slash]="showPassword"></i>
                </button>
                <div class="input-border"></div>
              </div>
            </div>

            <button type="submit"
                    class="btn-luxe btn-login"
                    [disabled]="loading">
              <span class="btn-content">
                <i class="fas fa-unlock-alt"></i>
                <span *ngIf="!loading">ACCÉDER À MON ESPACE</span>
                <span *ngIf="loading">CONNEXION EN COURS...</span>
              </span>
            </button>

            <div class="login-footer">
              <p class="register-link">
                Nouveau chez IMPERIA ?
                <a routerLink="/register" class="link-luxe">Créer un compte </a>
              </p>

            </div>
          </form>
        </div>

        <div class="login-features">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-gem"></i>
            </div>
            <h4>AVANTAGES EXCLUSIFS</h4>
            <p>Accès prioritaire aux nouvelles collections et événements privés</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h4>SÉCURITÉ MAXIMALE</h4>
            <p>Protection avancée de vos données et transactions</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-headset"></i>
            </div>
            <h4>SUPPORT VIP</h4>
            <p>Assistance personnalisée disponible 24h/24</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');

    :host {
      --primary-gold: #D4AF37;
      --dark-charcoal: #1A1A1A;
      --light-cream: #F5F3EF;
      --accent-burgundy: #8B0000;
      --metal-gray: #5D5D5D;
      --success-emerald: #2E8B57;
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Inter', sans-serif;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--dark-charcoal) 0%, #2A2A2A 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .login-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
    }

    .login-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .login-wrapper {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 3rem;
      max-width: 1200px;
      width: 100%;
      align-items: stretch;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 3rem;
      flex: 1;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .login-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
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
      font-size: 1.8rem;
      font-weight: 900;
      letter-spacing: 0.1rem;
      color: var(--dark-charcoal);
    }

    .logo-sub {
      font-size: 0.8rem;
      letter-spacing: 0.1rem;
      color: var(--metal-gray);
      text-transform: uppercase;
    }

    .login-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--dark-charcoal);
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;
    }

    .login-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: var(--primary-gold);
    }

    .login-subtitle {
      color: var(--metal-gray);
      font-size: 1.1rem;
      margin-top: 1.5rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group-luxe {
      position: relative;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--metal-gray);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
    }

    .form-label i {
      color: var(--primary-gold);
      font-size: 0.9rem;
    }

    .input-container {
      position: relative;
    }

    .form-input-luxe {
      width: 100%;
      padding: 1.2rem 1.5rem;
      border: 2px solid rgba(93, 93, 93, 0.2);
      border-radius: 12px;
      font-family: var(--font-body);
      font-size: 1rem;
      background: white;
      color: var(--dark-charcoal);
      transition: all 0.3s ease;
    }

    .form-input-luxe:focus {
      outline: none;
      border-color: var(--primary-gold);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: var(--primary-gold);
      transition: width 0.3s ease;
    }

    .form-input-luxe:focus ~ .input-border {
      width: 100%;
    }

    .password-toggle {
      position: absolute;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--metal-gray);
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.5rem;
      transition: color 0.3s ease;
    }

    .password-toggle:hover {
      color: var(--primary-gold);
    }

    .btn-luxe {
      padding: 1.2rem;
      border: none;
      font-family: var(--font-body);
      font-weight: 600;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      margin-top: 1rem;
    }

    .btn-luxe::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: 0.5s;
    }

    .btn-luxe:hover::before {
      left: 100%;
    }

    .btn-luxe:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-login {
      background: var(--primary-gold);
      color: var(--dark-charcoal);
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 0.9rem;
    }

    .login-footer {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(93, 93, 93, 0.1);
    }

    .register-link {
      text-align: center;
      color: var(--metal-gray);
      margin-bottom: 2rem;
    }

    .link-luxe {
      color: var(--primary-gold);
      text-decoration: none;
      font-weight: 600;
      position: relative;
      padding-bottom: 2px;
    }

    .link-luxe::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--primary-gold);
      transition: width 0.3s ease;
    }

    .link-luxe:hover::after {
      width: 100%;
    }

    .demo-info {
      background: rgba(212, 175, 55, 0.05);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 1.5rem;
    }

    .demo-info h6 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-gold);
      margin-bottom: 1rem;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .demo-account {
      font-size: 0.85rem;
      color: var(--metal-gray);
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 6px;
    }

    .demo-account strong {
      color: var(--dark-charcoal);
      margin-right: 0.5rem;
    }

    .login-features {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 400px;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 2rem;
      border: 1px solid rgba(212, 175, 55, 0.2);
      color: white;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      border-color: var(--primary-gold);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
    }

    .feature-icon {
      width: 60px;
      height: 60px;
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .feature-card h4 {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      margin-bottom: 0.8rem;
      color: white;
    }

    .feature-card p {
      opacity: 0.8;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    @media (max-width: 992px) {
      .login-wrapper {
        flex-direction: column;
      }

      .login-features {
        max-width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .feature-card {
        flex: 1;
        min-width: 250px;
      }
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 2rem;
      }

      .login-title {
        font-size: 2rem;
      }

      .feature-card {
        min-width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        const role = this.authService.getUserRole();
        const userName = this.authService.currentUserSig()?.name || 'Utilisateur';

        let welcomeMessage = `Bienvenue ${userName} !`;

        // CAS PARTICULIER : LE SHOP
        if (role === 'shop') {
          this.shopService.getShopByOwnerId().subscribe({
            next: (shop) => {
              if (shop.status === 'active') {
                alert(welcomeMessage);
                this.router.navigate(['/shop']);
              } else {
                alert("Votre boutique est en cours de validation par l'administrateur.");
                this.router.navigate(['/login']); // On redirige vers login ou home si pas actif
              }
              this.loading = false;
            },
            error: (err) => {
              console.error("Erreur shop:", err);
              this.loading = false;
              alert("Erreur lors de la récupération de votre boutique.");
            }
          });
          return; // IMPORTANT : On sort de la fonction ici pour ne pas exécuter le code ci-dessous
        }

        // CAS GÉNÉRAUX : ADMIN / BUYER
        let redirectPath = '/';
        if (role === 'admin') {
          welcomeMessage += '\nAccès au tableau de bord administrateur.';
          redirectPath = '/admin';
        } else if (role === 'buyer') {
          welcomeMessage += '\nAccès à votre espace client privilège.';
          redirectPath = '/buy';
        }

        alert(welcomeMessage);
        this.router.navigate([redirectPath]);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur login:', err);
        alert('Identifiants incorrects ou erreur serveur.');
        this.loading = false;
      }
    });
  }
}
