import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/stocks';

  addMovement(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  getMovementsByMaterial(materialId: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/material/${materialId}`);
  }
}