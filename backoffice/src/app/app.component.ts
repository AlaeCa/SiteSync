import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  adminName = '';
  adminInitials = '';
  searchTerm = '';

  constructor(public router: Router, private searchService: SearchService) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadAdmin();
    });
    this.loadAdmin();
  }

  loadAdmin(): void {
    const name = localStorage.getItem('adminName');
    if (name) {
      this.adminName = name;
      this.adminInitials = name.split(' ')
        .map((n: string) => n.charAt(0).toUpperCase())
        .join('').substring(0, 2);
    }
  }

  onSearch(term: string): void {
    this.searchService.setSearchTerm(term);
  }

  logout(): void {
    localStorage.clear();
    this.adminName = '';
    this.adminInitials = '';
    this.router.navigate(['/login']);
  }
}