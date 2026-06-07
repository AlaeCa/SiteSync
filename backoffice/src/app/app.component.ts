import { Component, inject, OnInit, ViewChild  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialService } from './services/material.service';
import { Material } from './models/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatePipe } from '@angular/common';
import { StockService } from './services/stock.service';
import { Stock } from './models/stock';
import { WebNotificationService } from './services/web-notification.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, FormsModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
 
})
export class AppComponent implements OnInit {

  private materialService = inject(MaterialService);

  materials: Material[] = [];

  showForm = false;
  editingId: string | null = null;
  formMaterial: Partial<Material> = {};

  private webNotif = inject(WebNotificationService);

  ngOnInit() {
    this.loadMaterials();
    this.webNotif.init(); 
    
  }

  @ViewChild(DashboardComponent) dashboard?: DashboardComponent;

  loadMaterials() {
    this.materialService.getMaterials().subscribe({
      next: (data) => this.materials = data,
      error: (err) => console.error('Erreur de chargement', err)
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'DISPONIBLE': return 'Disponible';
      case 'FAIBLE': return 'Faible';
      case 'EN_RUPTURE': return 'En rupture';
      default: return status;
    }
  }

  onAdd() {
    this.editingId = null;
    this.formMaterial = {};
    this.showForm = true;
  }

  onEdit(m: Material) {
    this.editingId = m.id;
    this.formMaterial = { ...m }; // copie, pour ne pas modifier la liste en direct
    this.showForm = true;
  }

  onDelete(m: Material) {
    if (!confirm(`Supprimer le matériau "${m.name}" ?`)) return;
    this.materialService.delete(m.id).subscribe({
      next: () => {this.loadMaterials();this.dashboard?.refresh();},
      error: (err) => console.error('Erreur de suppression',err)
    });
  }

  saveMaterial() {
    const obs = this.editingId
      ? this.materialService.update(this.editingId, this.formMaterial as Material)
      : this.materialService.create(this.formMaterial as Material);

    obs.subscribe({
      next: () => { this.closeForm(); this.loadMaterials(); this.dashboard?.refresh(); },
      error: (err) => console.error('Erreur lors de l\'enregistrement', err)
    });
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.formMaterial = {};
  }

  onMovement(m: Material) {
  this.movementMaterial = m;
  this.movement = { type: 'SORTIE', quantity: 0, reason: '' };
  this.movementError = '';
  this.showMovementForm = true;
  this.loadMovements(m.id);
}

loadMovements(materialId: string) {
  this.stockService.getMovementsByMaterial(materialId).subscribe({
    next: (data) => this.movements = data,
    error: (err) => console.error('Erreur de chargement des mouvements', err)
  });
}

saveMovement() {
  if (!this.movementMaterial) return;
  this.movementError = '';
  const matId = this.movementMaterial.id; 

  const stock: Stock = {
    materialId: matId,
    type: this.movement.type as 'ENTREE' | 'SORTIE',
    quantity: Number(this.movement.quantity),
    reason: this.movement.reason
  };

  this.stockService.addMovement(stock).subscribe({
    next: () => {
      this.materialService.getMaterials().subscribe(data => {
        this.materials = data;
        this.movementMaterial = data.find(m => m.id === matId) ?? this.movementMaterial;
      });
      this.loadMovements(matId);
      this.movement = { type: 'SORTIE', quantity: 0, reason: '' };
      this.dashboard?.refresh();
    },
    error: (err) => {
      this.movementError = err?.error?.message || 'Mouvement impossible (stock insuffisant ou quantité invalide).';
      console.error('Erreur lors du mouvement', err);
    }
  });
}

closeMovementForm() {
  this.showMovementForm = false;
  this.movementMaterial = null;
  this.movements = [];
  this.movementError = '';
}

  //Pour le menu dans les forms 
  categories: string[] = ['Gros œuvre', 'Construction', 'Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Outillage'];
  units: string[] = ['unité', 'kg', 'tonne', 'sac', 'm³', 'm²', 'm', 'L', 'pièce', 'palette'];
  
  private stockService = inject(StockService);

showMovementForm = false;
movementMaterial: Material | null = null;
movement: Partial<Stock> = { type: 'SORTIE', quantity: 0, reason: '' };
movements: Stock[] = [];
movementError = '';

//Filtrage
searchTerm = '';
statusFilter = '';     // '' = tous
categoryFilter = '';   // '' = toutes

get filteredMaterials(): Material[] {
  const term = this.searchTerm.toLowerCase();
  return this.materials.filter(m => {
    const matchNom = (m.name || '').toLowerCase().includes(term);
    const matchStatut = !this.statusFilter || m.status === this.statusFilter;
    const matchCat = !this.categoryFilter || m.category === this.categoryFilter;
    return matchNom && matchStatut && matchCat;
  });



  
}

}