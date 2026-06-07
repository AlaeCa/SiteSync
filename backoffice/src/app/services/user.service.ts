import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'CHEF' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  updateRole(id: string, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}/role`, { role });
  }

  updateStatus(id: string, status: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}/status`, { status });
  }
}