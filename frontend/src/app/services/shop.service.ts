// src/app/services/shop.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Shop } from '../models/shop.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shops`;

  createShop(shopData: Partial<Shop>): Observable<Shop> {
    // Note : On verra plus bas comment automatiser l'envoi du Token
    return this.http.post<Shop>(`${this.apiUrl}/shop-user`, shopData);
  }

  getShopByOwnerId(): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/owner`);
  }

  // src/app/services/shop.service.ts
  getPendingShops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  // shop.service.ts
  rejectShop(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/reject`, {});
  }

  approveShop(id: string, location: string): Observable<Shop> {
    // On envoie l'ID dans l'URL et la nouvelle location dans le body
    return this.http.patch<Shop>(`${this.apiUrl}/${id}/approve`, { location });
  }

  getActiveShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/active`);
  }

  getConnectedShop(): Observable<Shop> {
    return this.http.get<Shop>(`${this.apiUrl}/connected-shop`);
  }
}
