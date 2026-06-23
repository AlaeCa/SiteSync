import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }
    this.loading = true;
    this.error = '';

    this.http.post<any>('http://localhost:8080/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response.role !== 'ADMIN') {
          this.error = 'Accès refusé — Réservé aux administrateurs';
          this.loading = false;
          return;
        }
        localStorage.setItem('token', response.token);
        localStorage.setItem('adminName', response.name);
        localStorage.setItem('adminEmail', response.email);
        localStorage.setItem('adminRole', response.role);
        this.router.navigate(['/users']);
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}