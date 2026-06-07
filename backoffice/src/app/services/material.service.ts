import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material';
import { MaterialStat } from '../models/material-stat';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/materials';

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  getStats(): Observable<MaterialStat> {
    return this.http.get<MaterialStat>(`${this.apiUrl}/stats`);
  }

  create(material: Material): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, material);
  }

  update(id: string, material: Material): Observable<Material> {
    return this.http.put<Material>(`${this.apiUrl}/${id}`, material);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}