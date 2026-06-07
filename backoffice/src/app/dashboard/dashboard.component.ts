import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MaterialService } from '../services/material.service';
import { MaterialStat } from '../models/material-stat';
import { Material } from '../models/material';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private materialService = inject(MaterialService);

  @ViewChild('statusPie') statusPie!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryBar') categoryBar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quantityBar') quantityBar!: ElementRef<HTMLCanvasElement>;


  stats?: MaterialStat;
  materials: Material[] = [];

  private pieChart?: Chart;
  private barChart?: Chart;
  private quantityChart?: Chart;
  private viewReady = false;


  ngOnInit(): void {
    this.loadStats();
    this.loadMaterials();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderPieChart();
    this.renderBarChart();
    this.renderQuantityChart();
  }

  ngOnDestroy(): void {
    this.pieChart?.destroy();
    this.barChart?.destroy();
    this.quantityChart?.destroy();
  }

  private loadStats(): void {
    this.materialService.getStats().subscribe({
      next: (data: MaterialStat) => {
        this.stats = data;
        setTimeout(() => this.renderPieChart());
      },
      error: (err: unknown) => console.error('Erreur de chargement des stats', err)
    });
  }

  private loadMaterials(): void {
  this.materialService.getMaterials().subscribe({
    next: (data: Material[]) => {
      this.materials = data;
      setTimeout(() => {
        this.renderBarChart();
        this.renderQuantityChart();
      });
    },
    error: (err: unknown) => console.error('Erreur de chargement des matériaux', err)
  });
}

  private renderPieChart(): void {
    if (!this.viewReady || !this.stats || !this.statusPie) {
      return;
    }

    this.pieChart?.destroy();

    this.pieChart = new Chart(this.statusPie.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Disponibles', 'Stock faible', 'En rupture'],
        datasets: [
          {
            data: [
              this.stats.disponibles,
              this.stats.faibles,
              this.stats.en_rupture
            ],
            backgroundColor: ['#16a34a', '#f58216', '#dc2626'] 
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 14 },
            formatter: (value: number, context: any) => {
              const dataset = context.chart.data.datasets[0].data as number[];
              const total = dataset.reduce((sum, v) => sum + (v || 0), 0);
              return total ? ((value / total) * 100).toFixed(1) + '%' : '0%';
            }
          }
        }
      },
      plugins: [ChartDataLabels] // active les datalabels uniquement pour ce graphique
    });
  }

  private renderBarChart(): void {
    if (!this.viewReady || !this.materials.length || !this.categoryBar) {
      return;
    }

    const categoryMap = new Map<string, number>();

    this.materials.forEach((material: Material) => {
      const category = material.category || 'Non classé';
      const quantity = material.quantity || 0;
      const unitPrice = material.unitPrice || 0;
      categoryMap.set(category, (categoryMap.get(category) || 0) + quantity * unitPrice);
    });

    this.barChart?.destroy();

    this.barChart = new Chart(this.categoryBar.nativeElement, {
      type: 'bar',
      data: {
        labels: Array.from(categoryMap.keys()),
        datasets: [
          {
            label: 'Valeur totale par catégorie',
            data: Array.from(categoryMap.values()),
            backgroundColor: '#04266e'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private renderQuantityChart(): void {
  if (!this.viewReady || !this.materials.length || !this.quantityBar) {
    return;
  }
  this.quantityChart?.destroy();
  this.quantityChart = new Chart(this.quantityBar.nativeElement, {
    type: 'bar',
    data: {
      labels: this.materials.map(m => m.name),
      datasets: [{
        label: 'Quantité par matériau',
        data: this.materials.map(m => m.quantity || 0),
        backgroundColor: '#f97316'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { x: { beginAtZero: true } }
    }
  });
}

  refresh() {
  this.loadStats();
  this.loadMaterials();
}
}