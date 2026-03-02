import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
// IMPORT CORRECT : withInMemoryScrolling vient de @angular/router
import { provideRouter, withInMemoryScrolling } from '@angular/router'; 
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Le scrolling se configure dans le PROVIDE ROUTER
    provideRouter(
      routes, 
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    
    // On regroupe les intercepteurs dans un seul PROVIDE HTTP CLIENT
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    
    provideAnimations(),
  ]
};