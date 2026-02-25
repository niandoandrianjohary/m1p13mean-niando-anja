import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer-luxe">
      <div class="footer-main">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <div class="logo-mark">I</div>
                <div class="logo-text">
                  <div class="logo-primary">IMPERIA</div>
                  <div class="logo-sub">Shopping Center</div>
                </div>
              </div>
              <p class="brand-description">
                La destination shopping la plus exclusive de Madagascar,
                 élégance et service personnalisé dans un
                cadre architectural exceptionnel.
              </p>
              <div class="social-links">
                <a href="#" class="social-link">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-link">
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            <div class="footer-section">
              <h4 class="section-title">EXPLORER</h4>
              <ul class="footer-links">
                <li><a href="#">Boutiques </a></li>
                <li><a href="#">Événements </a></li>
                <li><a href="#">Services </a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4 class="section-title">SERVICES</h4>
              <ul class="footer-links">
                <li><a href="#">Personal Shopper</a></li>
                <li><a href="#">Conciergerie 24/7</a></li>
                <li><a href="#">Parking</a></li>
                <li><a href="#">Réservations </a></li>
                <li><a href="#">Services de Livraison</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4 class="section-title">CONTACT PRIVILÈGE</h4>
              <div class="contact-info">
                <div class="contact-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span> Antananarivo 101<br>Madagascar</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-phone"></i>
                  <span>+261 34 00 000 00</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                   <span>info&#64;imperia.mg</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-clock"></i>
                  <span>7j/7 - 8h à 22h<br></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <div class="bottom-content">
            <p class="copyright">
              &copy; 2026 IMPERIA Shopping Center. Tous droits réservés.
              <span class="divider">|</span>
              <a href="#">Mentions légales</a>
              <span class="divider">|</span>
              <a href="#">Politique de confidentialité</a>
            </p>
          </div>
          <div class="credits-line">
            Projet  réalisé par
            <span class="student-name">Niando .......</span> &
            <span class="student-name">Rakotonanahary Anja Liantsoa Stephanie</span>
          </div>
        </div>
      </div>
    </footer>
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

    .footer-luxe {
      font-family: var(--font-body);
      background: var(--dark-charcoal);
      color: white;
    }

    .footer-main {
      padding: 4rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 3rem;
    }

    .footer-brand {
      padding-right: 2rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .logo-mark {
      width: 40px;
      height: 40px;
      background: var(--primary-gold);
      color: var(--dark-charcoal);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 900;
    }

    .logo-text {
      line-height: 1;
    }

    .logo-primary {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 900;
      letter-spacing: 0.1rem;
      color: white;
    }

    .logo-sub {
      font-size: 0.6rem;
      letter-spacing: 0.1rem;
      color: var(--primary-gold);
      text-transform: uppercase;
    }

    .brand-description {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      width: 36px;
      height: 36px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: var(--primary-gold);
      border-color: var(--primary-gold);
      color: var(--dark-charcoal);
      transform: translateY(-3px);
    }

    .footer-section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: white;
      position: relative;
      padding-bottom: 0.5rem;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: var(--primary-gold);
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.8rem;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
      position: relative;
      padding-left: 0;
      transition: padding-left 0.3s ease;
    }

    .footer-links a:hover {
      color: var(--primary-gold);
      padding-left: 10px;
    }

    .footer-links a::before {
      content: '→';
      position: absolute;
      left: -10px;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .footer-links a:hover::before {
      left: 0;
      opacity: 1;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .contact-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .contact-item i {
      color: var(--primary-gold);
      font-size: 1rem;
      margin-top: 0.2rem;
      min-width: 20px;
    }

    .contact-item span {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .footer-bottom {
      padding: 1.5rem 0;
      background: rgba(0, 0, 0, 0.2);
    }

    .bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .copyright {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      margin: 0;
    }

    .copyright a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .copyright a:hover {
      color: var(--primary-gold);
    }

    .divider {
      margin: 0 1rem;
      opacity: 0.3;
    }

    .payment-methods {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      font-size: 1.5rem;
      color: rgba(255, 255, 255, 0.7);
    }

    /* Nouveaux styles pour les crédits académiques */
    .credits-line {
      text-align: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
    }

    .student-name {
      color: var(--primary-gold);
      font-weight: 600;
      position: relative;
      display: inline-block;
    }

    .student-name:hover {
      text-decoration: underline;
      text-decoration-color: var(--primary-gold);
      text-underline-offset: 4px;
    }

    /* Responsive */
    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .bottom-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .credits-line {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        font-size: 0.8rem;
      }

      .student-name {
        display: block;
        margin: 0.2rem 0;
      }
    }
  `]
})
export class FooterComponent {}
