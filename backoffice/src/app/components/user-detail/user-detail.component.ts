import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (user: any) => {
          this.user = { ...user, id: user.id || user._id };
          this.loading = false;
        },
        error: () => { this.snackBar.open('Erreur', 'Fermer', { duration: 2000 }); this.loading = false; }
      });
    }
  }

  changeRole(role: string): void {
    if (!this.user) return;
    this.userService.updateRole(this.user.id, role).subscribe({
      next: () => { this.user!.role = role as User['role']; this.snackBar.open('Rôle mis à jour ✅', 'Fermer', { duration: 2000 }); }
    });
  }

  toggleStatus(): void {
    if (!this.user) return;
    const newStatus = this.user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.userService.updateStatus(this.user.id, newStatus).subscribe({
      next: () => { this.user!.status = newStatus; this.snackBar.open(`Compte ${newStatus} ✅`, 'Fermer', { duration: 2000 }); }
    });
  }

  goBack(): void { this.router.navigate(['/users']); }
}