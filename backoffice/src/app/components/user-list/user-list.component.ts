import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from '../../services/user.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  statusFilter = 'ALL';
  displayedColumns = ['name', 'email', 'role', 'status', 'createdAt', 'actions'];
  private searchSub!: Subscription;
  private currentSearchTerm = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.currentSearchTerm = term;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur de chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = this.users;

    if (this.currentSearchTerm) {
      result = result.filter(u =>
        u.name?.toLowerCase().includes(this.currentSearchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.currentSearchTerm.toLowerCase())
      );
    }

    if (this.statusFilter !== 'ALL') {
      result = result.filter(u => u.status === this.statusFilter);
    }

    this.filteredUsers = result;
  }

  onStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  changeRole(user: User, role: string): void {
    this.userService.updateRole(user.id, role).subscribe({
      next: () => {
        user.role = role as User['role'];
        this.snackBar.open('Rôle mis à jour ✅', 'Fermer', { duration: 2000 });
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 2000 })
    });
  }

  toggleStatus(user: User): void {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.userService.updateStatus(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
        this.snackBar.open(`Compte ${newStatus} ✅`, 'Fermer', { duration: 2000 });
        this.applyFilters();
      },
      error: () => this.snackBar.open('Erreur', 'Fermer', { duration: 2000 })
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/users', id]);
  }
}