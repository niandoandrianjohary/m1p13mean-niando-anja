import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ShopService } from '../../../services/shop.service';
import { switchMap, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-background">
        <div class="register-gradient"></div>
        <div class="register-pattern"></div>
      </div>

      <div class="register-wrapper">
        <div class="register-header">
          <div class="header-content">
            <div class="logo-wrapper">
              <div class="logo-mark">I</div>
              <div class="logo-text">
                <div class="logo-primary">IMPERIA</div>
                <div class="logo-sub">Adhésion </div>
              </div>
            </div>
            <h1 class="register-title">DEVENIR MEMBRE EXCLUSIF</h1>
            <p class="register-subtitle">
              Rejoignez notre communauté d'élite et bénéficiez d'avantages exclusifs
            </p>
          </div>

          <div class="progress-steps">
            <div class="step" [class.active]="step === 1" [class.completed]="step > 1">
              <div class="step-number">1</div>
              <span class="step-label">Profil</span>
            </div>
            <div class="step-line" [class.active]="step >= 2"></div>
            <div class="step" [class.active]="step === 2" [class.completed]="step > 2">
              <div class="step-number">2</div>
              <span class="step-label">Type de compte</span>
            </div>
            <div class="step-line" [class.active]="step >= 3"></div>
            <div class="step" [class.active]="step === 3">
              <div class="step-number">3</div>
              <span class="step-label">Validation</span>
            </div>
          </div>
        </div>

        <div class="register-card">
          <!-- Étape 1 : Sélection du type de compte -->
          <div *ngIf="step === 1" class="register-step">
            <div class="step-header">
              <h2><i class="fas fa-user-tie"></i> CHOISISSEZ VOTRE PROFIL</h2>
              <p>Sélectionnez le type de compte qui correspond à vos besoins</p>
            </div>

            <div class="role-selection">
              <div class="role-card" [class.selected]="selectedRole === 'buyer'"
                   (click)="selectRole('buyer')">
                <div class="role-icon">
                  <i class="fas fa-user"></i>
                </div>
                <h3>CLIENT </h3>
                <ul class="role-features">
                  <li><i class="fas fa-check-circle"></i> Accès aux collections exclusives</li>
                  <li><i class="fas fa-check-circle"></i> Invitations aux événements VIP</li>
                  <li><i class="fas fa-check-circle"></i> Service Personal Shopper</li>
                  <li><i class="fas fa-check-circle"></i> Livraison prioritaire gratuite</li>
                  <li><i class="fas fa-check-circle"></i> Retours illimités</li>
                </ul>
                <div class="role-footer">
                  <span class="role-badge">Compte immédiat</span>
                </div>
              </div>

              <div class="role-card" [class.selected]="selectedRole === 'shop'"
                   (click)="selectRole('shop')">
                <div class="role-icon">
                  <i class="fas fa-store"></i>
                </div>
                <h3>PARTENAIRE BOUTIQUE</h3>
                <ul class="role-features">
                  <li><i class="fas fa-check-circle"></i> Vitrine digitale exclusive</li>
                  <li><i class="fas fa-check-circle"></i> Gestion avancée des stocks</li>
                  <li><i class="fas fa-check-circle"></i> Statistiques détaillées</li>
                  <li><i class="fas fa-check-circle"></i> Support dédié 24/7</li>
                  <li><i class="fas fa-check-circle"></i> Promotion sur la plateforme</li>
                </ul>
                <div class="role-footer">
                  <span class="role-badge badge-warning">Validation requise</span>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-luxe btn-outline" routerLink="/login">
                <i class="fas fa-arrow-left"></i> RETOUR À LA CONNEXION
              </button>
              <button class="btn-luxe btn-primary" (click)="nextStep()" [disabled]="!selectedRole">
                SUIVANT <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- Étape 2 : Informations personnelles -->
          <div *ngIf="step === 2" class="register-step">
            <div class="step-header">
              <h2><i class="fas fa-user-circle"></i> INFORMATIONS PERSONNELLES</h2>
              <p>Complétez vos informations pour créer votre compte</p>
            </div>

            <form [formGroup]="registerForm" class="register-form">
              <div class="form-grid">
                <div class="form-group-luxe">
                  <label class="form-label">
                    <i class="fas fa-user"></i>
                    NOM COMPLET *
                  </label>
                  <div class="input-container">
                    <input type="text"
                           class="form-input-luxe"
                           [class.is-invalid]="f['fullName'].touched && f['fullName'].invalid"
                           formControlName="fullName"
                           placeholder="Ex: Marie Laurent">
                    <div class="input-border"></div>
                  </div>
                  <div class="form-error" *ngIf="f['fullName'].touched && f['fullName'].hasError('required')">
                    Ce champ est obligatoire
                  </div>
                </div>

                <div class="form-group-luxe">
                  <label class="form-label">
                    <i class="fas fa-envelope"></i>
                    ADRESSE EMAIL *
                  </label>
                  <div class="input-container">
                    <input type="email"
                           class="form-input-luxe"
                           [class.is-invalid]="f['email'].touched && f['email'].invalid"
                           formControlName="email"
                           placeholder="marie.laurent@email.mg">
                    <div class="input-border"></div>
                  </div>
                  <div class="form-error" *ngIf="f['email'].touched && f['email'].hasError('required')">
                    Ce champ est obligatoire
                  </div>
                  <div class="form-error" *ngIf="f['email'].touched && f['email'].hasError('email')">
                    Email invalide
                  </div>
                </div>

                <div class="form-group-luxe">
                  <label class="form-label">
                    <i class="fas fa-phone"></i>
                    TÉLÉPHONE *
                  </label>
                  <div class="input-container">
                    <div class="input-group">
                      <span class="input-prefix">+261</span>
                      <input type="tel"
                             class="form-input-luxe"
                             [class.is-invalid]="f['phone'].touched && f['phone'].invalid"
                             formControlName="phone"
                             placeholder="34 00 000 00">
                    </div>
                    <div class="input-border"></div>
                  </div>
                  <div class="form-error" *ngIf="f['phone'].touched && f['phone'].hasError('required')">
                    Ce champ est obligatoire
                  </div>
                </div>

                <div class="form-group-luxe">
                  <label class="form-label">
                    <i class="fas fa-map-marker-alt"></i>
                    ADRESSE
                  </label>
                  <div class="input-container">
                    <input type="text"
                           class="form-input-luxe"
                           formControlName="address"
                           placeholder="Ivandry, Antananarivo">
                    <div class="input-border"></div>
                  </div>
                </div>
              </div>

              <div class="password-section">
                <h4><i class="fas fa-key"></i> SÉCURISATION DU COMPTE</h4>
                <div class="form-grid">
                  <div class="form-group-luxe">
                    <label class="form-label">
                      MOT DE PASSE *
                    </label>
                    <div class="input-container">
                      <input [type]="showPassword ? 'text' : 'password'"
                             class="form-input-luxe"
                             [class.is-invalid]="f['password'].touched && f['password'].invalid"
                             formControlName="password"
                             placeholder="Minimum 8 caractères">
                      <button type="button"
                              class="password-toggle"
                              (click)="togglePassword()">
                        <i class="fas" [class.fa-eye]="!showPassword"
                           [class.fa-eye-slash]="showPassword"></i>
                      </button>
                      <div class="input-border"></div>
                    </div>
                    <div class="form-error" *ngIf="f['password'].touched && f['password'].hasError('required')">
                      Ce champ est obligatoire
                    </div>
                    <div class="form-error" *ngIf="f['password'].touched && f['password'].hasError('minlength')">
                      Minimum 8 caractères requis
                    </div>
                  </div>

                  <div class="form-group-luxe">
                    <label class="form-label">
                      CONFIRMER LE MOT DE PASSE *
                    </label>
                    <div class="input-container">
                      <input type="password"
                             class="form-input-luxe"
                             [class.is-invalid]="f['confirmPassword'].touched && registerForm.hasError('passwordMismatch')"
                             formControlName="confirmPassword"
                             placeholder="Retapez votre mot de passe">
                      <div class="input-border"></div>
                    </div>
                    <div class="form-error" *ngIf="f['confirmPassword'].touched && registerForm.hasError('passwordMismatch')">
                      Les mots de passe ne correspondent pas
                    </div>
                  </div>
                </div>
              </div>

              <!-- Informations boutique -->
              <div *ngIf="selectedRole === 'shop'" class="shop-section">
                <div class="section-header">
                  <h4><i class="fas fa-store"></i> INFORMATIONS BOUTIQUE</h4>
                  <p class="section-info">
                    <i class="fas fa-info-circle"></i>
                    Votre demande sera examinée sous 24-48 heures par notre équipe
                  </p>
                </div>

                <div class="form-grid">
                  <div class="form-group-luxe">
                    <label class="form-label">
                      NOM DE LA BOUTIQUE *
                    </label>
                    <div class="input-container">
                      <input type="text"
                             class="form-input-luxe"
                             [class.is-invalid]="f['shopName'].touched && f['shopName'].invalid"
                             formControlName="shopName"
                             placeholder="Ex: Zara Collection">
                      <div class="input-border"></div>
                    </div>
                    <div class="form-error" *ngIf="f['shopName'].touched && f['shopName'].hasError('required')">
                      Ce champ est obligatoire
                    </div>
                  </div>

                  <div class="form-group-luxe">
                    <label class="form-label">
                      CATÉGORIE *
                    </label>
                    <div class="input-container">
                      <select class="form-input-luxe"
                              [class.is-invalid]="f['shopCategory'].touched && f['shopCategory'].invalid"
                              formControlName="shopCategory">
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="fashion">Mode & Vêtements</option>
                        <option value="electronics">Électronique & Technologie</option>
                        <option value="food">Restauration & Gastronomie</option>
                        <option value="beauty">Beauté & Cosmétique</option>
                        <option value="jewelry">Bijouterie & Horlogerie</option>
                        <option value="home">Maison & Décoration</option>
                        <option value="sports">Sports & Loisirs</option>
                        <option value="other">Autre</option>
                      </select>
                      <div class="input-border"></div>
                    </div>
                    <div class="form-error" *ngIf="f['shopCategory'].touched && f['shopCategory'].hasError('required')">
                      Ce champ est obligatoire
                    </div>
                  </div>
                </div>

                <div class="form-group-luxe">
                  <label class="form-label">
                    DESCRIPTION DE LA BOUTIQUE
                  </label>
                  <div class="input-container">
                    <textarea class="form-input-luxe"
                              rows="3"
                              formControlName="shopDescription"
                              placeholder="Décrivez votre boutique, vos produits, votre philosophie..."></textarea>
                    <div class="input-border"></div>
                  </div>
                </div>
              </div>

              <!-- Conditions générales -->
              <div class="terms-section">
                <div class="terms-checkbox">
                  <input type="checkbox"
                         id="acceptTerms"
                         class="checkbox-luxe"
                         [class.is-invalid]="f['acceptTerms'].touched && f['acceptTerms'].invalid"
                         formControlName="acceptTerms">
                  <label for="acceptTerms" class="terms-label">
                    <span class="checkbox-custom"></span>
                    Je déclare avoir lu et accepté les
                    <a href="#" class="terms-link">conditions générales d'utilisation</a>
                    et la
                    <a href="#" class="terms-link">politique de confidentialité</a>
                    d'IMPERIA Shopping Center.
                  </label>
                </div>
                <div class="form-error" *ngIf="f['acceptTerms'].touched && f['acceptTerms'].hasError('required')">
                  Vous devez accepter les conditions générales
                </div>
              </div>

              <div class="step-actions">
                <button type="button" class="btn-luxe btn-outline" (click)="prevStep()">
                  <i class="fas fa-arrow-left"></i> RETOUR
                </button>
                <button type="button"
                        class="btn-luxe btn-primary"
                        (click)="validateAndSubmit()"
                        [disabled]="registerForm.invalid || loading">
                  <span *ngIf="!loading">
                    {{ selectedRole === 'shop' ? 'SOUMETTRE LA DEMANDE' : 'CRÉER MON COMPTE' }}
                    <i class="fas fa-check-circle"></i>
                  </span>
                  <span *ngIf="loading">
                    <i class="fas fa-spinner fa-spin"></i> TRAITEMENT...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Étape 3 : Confirmation -->
          <div *ngIf="step === 3" class="register-step confirmation-step">
            <div class="confirmation-content">
              <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
              </div>

              <h2>DEMANDE ENREGISTRÉE AVEC SUCCÈS !</h2>

              <div class="confirmation-message" *ngIf="selectedRole === 'shop'">
                <p>
                  Votre demande de compte boutique a été soumise avec succès.
                  Notre équipe va l'examiner sous 24-48 heures.
                </p>
                <div class="info-card">
                  <i class="fas fa-clock"></i>
                  <div>
                    <strong>Prochaine étape :</strong>
                    <p>
                      Vous recevrez un email de confirmation une fois votre compte validé.
                      Vous pourrez alors accéder à votre espace boutique.
                    </p>
                  </div>
                </div>
              </div>

              <div class="confirmation-message" *ngIf="selectedRole === 'buyer'">
                <p>
                  Votre compte client privilège a été créé avec succès.
                  Bienvenue chez IMPERIA !
                </p>
                <div class="info-card">
                  <i class="fas fa-gift"></i>
                  <div>
                    <strong>Bienvenue bonus :</strong>
                    <p>
                      Profitez immédiatement de 10% de réduction sur votre première commande
                      avec le code : <strong class="promo-code">WELCOME10</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div class="user-summary">
                <h4>RÉCAPITULATIF DE VOTRE INSCRIPTION</h4>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Nom :</span>
                    <span class="summary-value">{{ registerForm.value.fullName }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Email :</span>
                    <span class="summary-value">{{ registerForm.value.email }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Type de compte :</span>
                    <span class="summary-value">{{ getRoleLabel() }}</span>
                  </div>
                  <div *ngIf="selectedRole === 'shop'" class="summary-item">
                    <span class="summary-label">Boutique :</span>
                    <span class="summary-value">{{ registerForm.value.shopName }}</span>
                  </div>
                </div>
              </div>

              <div class="confirmation-actions">
                <button class="btn-luxe btn-primary" (click)="connect()">
                  <i class="fas fa-sign-in-alt"></i> SE CONNECTER
                </button>
                <button class="btn-luxe btn-outline" routerLink="/">
                  <i class="fas fa-home"></i> RETOUR À L'ACCUEIL
                </button>
              </div>

              <div class="support-info">
                <p>
                  <i class="fas fa-headset"></i>
                  Besoin d'aide ? Contactez notre service client au
                  <a href="tel:+261340000000" class="support-link">+261 34 00 000 00</a>
                  ou par email à
                  <a href="mailto:concierge@imperia.mg" class="email-link-luxe">concierge&#64;imperia.mg</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="register-sidebar">
          <div class="sidebar-card">
            <h4><i class="fas fa-shield-alt"></i> SÉCURITÉ GARANTIE</h4>
            <p>
              Vos données sont protégées par un cryptage de niveau bancaire.
              Nous ne partageons jamais vos informations personnelles.
            </p>
          </div>

          <div class="sidebar-card">
            <h4><i class="fas fa-star"></i> AVANTAGES EXCLUSIFS</h4>
            <ul class="advantages-list">
              <li><i class="fas fa-check"></i> Accès 24/7 à votre compte</li>
              <li><i class="fas fa-check"></i> Support prioritaire</li>
              <li><i class="fas fa-check"></i> Offres personnalisées</li>
              <li><i class="fas fa-check"></i> Événements privés</li>
            </ul>
          </div>

          <div class="sidebar-card">
            <h4><i class="fas fa-question-circle"></i> QUESTIONS FRÉQUENTES</h4>
            <div class="faq-item">
              <strong>Combien de temps pour activer mon compte boutique ?</strong>
              <p>Généralement 24-48 heures ouvrables après soumission des documents requis.</p>
            </div>
            <div class="faq-item">
              <strong>Puis-je changer de type de compte plus tard ?</strong>
              <p>Oui, contactez notre service client pour modifier votre profil.</p>
            </div>
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
      --warning-amber: #FFA000;
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Inter', sans-serif;
    }

    .register-container {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--dark-charcoal) 0%, #2A2A2A 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .register-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .register-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
    }

    .register-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4AF37' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    }

    .register-wrapper {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
    }

    .register-header {
      text-align: center;
      margin-bottom: 3rem;
      color: white;
    }

    .header-content {
      margin-bottom: 2rem;
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .logo-mark {
      width: 60px;
      height: 60px;
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 900;
    }

    .logo-text {
      line-height: 1;
    }

    .logo-primary {
      font-family: var(--font-heading);
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: 0.1rem;
      color: white;
    }

    .logo-sub {
      font-size: 0.9rem;
      letter-spacing: 0.1rem;
      color: var(--primary-gold);
      text-transform: uppercase;
    }

    .register-title {
      font-family: var(--font-heading);
      font-size: 2.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;
    }

    .register-title::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 3px;
      background: var(--primary-gold);
    }

    .register-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.2rem;
      margin-top: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 3rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      border-color: var(--primary-gold);
    }

    .step.completed .step-number {
      background: var(--success-emerald);
      color: white;
      border-color: var(--success-emerald);
    }

    .step-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
    }

    .step.active .step-label {
      color: white;
    }

    .step-line {
      width: 80px;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .step-line.active::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--primary-gold);
      animation: progressLine 1s ease-in-out;
    }

    @keyframes progressLine {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    .register-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(212, 175, 55, 0.2);
    }

    .register-step {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .step-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .step-header h2 {
      font-family: var(--font-heading);
      font-size: 2rem;
      color: var(--dark-charcoal);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .step-header h2 i {
      color: var(--primary-gold);
    }

    .step-header p {
      color: var(--metal-gray);
      font-size: 1.1rem;
    }

    .role-selection {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .role-card {
      background: var(--light-cream);
      border-radius: 15px;
      padding: 2.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .role-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: transparent;
      transition: background 0.3s ease;
    }

    .role-card.selected::before {
      background: var(--primary-gold);
    }

    .role-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    }

    .role-card.selected {
      border-color: var(--primary-gold);
      box-shadow: 0 15px 40px rgba(212, 175, 55, 0.2);
    }

    .role-icon {
      width: 80px;
      height: 80px;
      background: rgba(212, 175, 55, 0.1);
      color: var(--primary-gold);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      margin: 0 auto 1.5rem;
    }

    .role-card.selected .role-icon {
      background: var(--primary-gold);
      color: white;
    }

    .role-card h3 {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      text-align: center;
      margin-bottom: 1.5rem;
      color: var(--dark-charcoal);
    }

    .role-features {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }

    .role-features li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
      color: var(--metal-gray);
      font-size: 0.95rem;
    }

    .role-features li i {
      color: var(--success-emerald);
    }

    .role-footer {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(93, 93, 93, 0.1);
    }

    .role-badge {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background: var(--success-emerald);
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
    }

    .badge-warning {
      background: var(--warning-amber);
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 3rem;
    }

    .btn-luxe {
      padding: 1rem 2rem;
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
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
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

    .btn-primary {
      background: var(--primary-gold);
      color: var(--dark-charcoal);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
    }

    .btn-outline {
      background: transparent;
      color: var(--dark-charcoal);
      border: 2px solid var(--metal-gray);
    }

    .btn-outline:hover {
      border-color: var(--primary-gold);
      color: var(--primary-gold);
    }

    .register-form {
      margin-top: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
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

    .form-input-luxe[type="tel"] {
      width: 75%;
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

    .form-input-luxe.is-invalid {
      border-color: var(--accent-burgundy);
    }

    .form-input-luxe.is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
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

    .input-group {
      display: flex;
    }

    .input-prefix {
      padding: 1.2rem 1rem;
      background: var(--light-cream);
      border: 2px solid rgba(93, 93, 93, 0.2);
      border-right: none;
      border-radius: 12px 0 0 12px;
      color: var(--metal-gray);
      font-weight: 600;
    }

    .input-group .form-input-luxe {
      border-radius: 0 12px 12px 0;
      border-left: none;
    }

    .input-group .input-border {
      bottom: -2px;
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

    .form-error {
      color: var(--accent-burgundy);
      font-size: 0.85rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-error::before {
      content: '⚠';
    }

    .password-section, .shop-section, .terms-section {
      margin-top: 2.5rem;
      padding-top: 2.5rem;
      border-top: 1px solid rgba(93, 93, 93, 0.1);
    }

    .password-section h4, .shop-section h4 {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      color: var(--dark-charcoal);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .password-section h4 i, .shop-section h4 i {
      color: var(--primary-gold);
    }

    .section-header {
      margin-bottom: 2rem;
    }

    .section-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--metal-gray);
      font-size: 0.95rem;
      background: rgba(212, 175, 55, 0.05);
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid var(--primary-gold);
    }

    .section-info i {
      color: var(--primary-gold);
      font-size: 1.2rem;
    }

    textarea.form-input-luxe {
      resize: vertical;
      min-height: 100px;
    }

    select.form-input-luxe {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%235D5D5D' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1.5rem center;
      background-size: 16px;
      padding-right: 3rem;
    }

    .terms-checkbox {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .checkbox-luxe {
      display: none;
    }

    .checkbox-custom {
      width: 24px;
      height: 24px;
      border: 2px solid var(--metal-gray);
      border-radius: 6px;
      display: inline-block;
      position: relative;
      flex-shrink: 0;
      margin-top: 0.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .checkbox-luxe:checked + .terms-label .checkbox-custom {
      background: var(--primary-gold);
      border-color: var(--primary-gold);
    }

    .checkbox-luxe:checked + .terms-label .checkbox-custom::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--dark-charcoal);
      font-weight: bold;
      font-size: 0.9rem;
    }

    .checkbox-luxe.is-invalid + .terms-label .checkbox-custom {
      border-color: var(--accent-burgundy);
    }

    .terms-label {
      cursor: pointer;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--metal-gray);
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .terms-link {
      color: var(--primary-gold);
      text-decoration: none;
      font-weight: 600;
      position: relative;
    }

    .terms-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--primary-gold);
      transition: width 0.3s ease;
    }

    .terms-link:hover::after {
      width: 100%;
    }

    .confirmation-step {
      text-align: center;
    }

    .confirmation-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .confirmation-icon {
      width: 100px;
      height: 100px;
      background: var(--success-emerald);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      margin: 0 auto 2rem;
    }

    .confirmation-content h2 {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      color: var(--dark-charcoal);
      margin-bottom: 1.5rem;
    }

    .confirmation-message {
      margin-bottom: 2.5rem;
    }

    .confirmation-message p {
      font-size: 1.2rem;
      color: var(--metal-gray);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .info-card {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      background: rgba(46, 139, 87, 0.05);
      border: 1px solid rgba(46, 139, 87, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
    }

    .info-card i {
      color: var(--success-emerald);
      font-size: 1.5rem;
      margin-top: 0.2rem;
    }

    .info-card strong {
      color: var(--dark-charcoal);
      display: block;
      margin-bottom: 0.5rem;
    }

    .promo-code {
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-family: monospace;
      font-size: 1.2rem;
      letter-spacing: 0.1rem;
      margin-left: 0.5rem;
    }

    .user-summary {
      background: var(--light-cream);
      border-radius: 15px;
      padding: 2rem;
      margin: 2.5rem 0;
    }

    .user-summary h4 {
      font-family: var(--font-heading);
      font-size: 1.3rem;
      color: var(--dark-charcoal);
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid rgba(93, 93, 93, 0.1);
    }

    .summary-label {
      font-weight: 600;
      color: var(--metal-gray);
    }

    .summary-value {
      color: var(--dark-charcoal);
      font-weight: 500;
    }

    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin: 2.5rem 0;
    }

    .support-info {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(93, 93, 93, 0.1);
      color: var(--metal-gray);
    }

    .support-link, .email-link-luxe {
      color: var(--primary-gold);
      text-decoration: none;
      font-weight: 600;
    }

    .support-link:hover, .email-link-luxe:hover {
      text-decoration: underline;
    }

    .register-sidebar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .sidebar-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 2rem;
      border: 1px solid rgba(212, 175, 55, 0.2);
      color: white;
    }

    .sidebar-card h4 {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      color: white;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .sidebar-card h4 i {
      color: var(--primary-gold);
    }

    .sidebar-card p {
      opacity: 0.8;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .advantages-list {
      list-style: none;
      padding: 0;
      margin-top: 1rem;
    }

    .advantages-list li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.8rem;
      font-size: 0.95rem;
    }

    .advantages-list li i {
      color: var(--success-emerald);
    }

    .faq-item {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .faq-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .faq-item strong {
      display: block;
      margin-bottom: 0.5rem;
      color: white;
    }

    .faq-item p {
      font-size: 0.9rem;
      opacity: 0.8;
      line-height: 1.5;
    }

    @media (max-width: 1200px) {
      .register-wrapper {
        max-width: 100%;
      }
    }

    @media (max-width: 992px) {
      .register-title {
        font-size: 2.2rem;
      }

      .role-selection {
        grid-template-columns: 1fr;
      }

      .step-actions {
        flex-direction: column;
        gap: 1rem;
      }

      .btn-luxe {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .register-container {
        padding: 1rem;
      }

      .register-card {
        padding: 2rem;
      }

      .progress-steps {
        flex-wrap: wrap;
      }

      .step-line {
        width: 40px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .confirmation-actions {
        flex-direction: column;
      }
    }
  `]
})

export class RegisterComponent {
  selectedRole: 'buyer' | 'shop' | null = null;
  showPassword = false;
  loading = false;
  step = 1;

  registerForm!: FormGroup;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private shopService: ShopService // <--- Ajout ici
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: [''],
      shopName: [''],
      shopCategory: [''],
      shopDescription: [''],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  selectRole(role: 'buyer' | 'shop'): void {
    this.selectedRole = role;

    if (role === 'shop') {
      this.registerForm.get('shopName')?.setValidators([Validators.required]);
      this.registerForm.get('shopCategory')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('shopName')?.clearValidators();
      this.registerForm.get('shopCategory')?.clearValidators();
    }

    this.registerForm.get('shopName')?.updateValueAndValidity();
    this.registerForm.get('shopCategory')?.updateValueAndValidity();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  nextStep(): void {
    if (this.step === 1 && this.selectedRole) {
      this.step = 2;
    }
  }

  prevStep(): void {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  getRoleLabel(): string {
    switch (this.selectedRole) {
      case 'buyer': return 'Client Privilège';
      case 'shop': return 'Partenaire Boutique';
      default: return '';
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  // 'of' permet de créer un Observable vide pour sortir proprement

  validateAndSubmit(): void {
  // 1. Validation de sécurité
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    const firstInvalid = document.querySelector('.is-invalid');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  this.loading = true;

  // 2. Préparation des données pour l'API
  const formData = { 
    ...this.registerForm.value, 
    role: this.selectedRole 
  };

  console.log('Tentative d\'inscription pour :', formData.email);

  // 3. Début du flux réactif
  this.authService.register(formData).pipe(
    // On utilise tap pour debugger dès que l'inscription réussit
    tap((res) => {
      console.log('✅ Inscription réussie !');
      console.log('🔑 Token reçu de l\'API :', res.token);
      console.log('👤 Utilisateur créé :', res.user);
      // À ce stade, le service a déjà fait le localStorage.setItem via son propre tap
    }),

    // switchMap permet de passer à la création du shop si nécessaire
    switchMap((res) => {
      if (this.selectedRole === 'shop') {
        console.log('🚀 Role "shop" détecté. Création de la boutique en cours...');
        
        const shopData = {
          name: formData.shopName,
          category: formData.shopCategory,
          description: formData.shopDescription,
          location: formData.location || 'Non précisée'
        };

        // L'intercepteur ajoutera automatiquement le token car il est déjà stocké
        return this.shopService.createShop(shopData);
      }

      // Si c'est un acheteur (buyer), on continue avec la réponse de l'inscription
      console.log('ℹ️ Role "buyer" détecté. Pas de boutique à créer.');
      return of(res); 
    })
  ).subscribe({
    next: (finalResult) => {
      console.log('✨ Tout le processus est terminé avec succès !', finalResult);
      this.loading = false;
      this.step = 3; // On affiche l'écran de succès
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ Erreur durant le processus :', err);
      
      // Gestion d'erreur propre
      const errorMsg = err.error?.message || "Une erreur est survenue lors de l'inscription.";
      alert(errorMsg);
    }
  });
}

  // Petites fonctions helper pour garder le code propre
  private completeRegistration() {
    this.loading = false;
    this.step = 3;
  }

  private handleError(err: any, defaultMsg: string) {
    this.loading = false;
    console.error(err);
    alert(err.error?.message || defaultMsg);
  }

  connect() {
    const token = localStorage.getItem('token');
    const role = this.authService.getUserRole();
    if (token && role === 'buyer') {
      this.router.navigate(['/buy']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
