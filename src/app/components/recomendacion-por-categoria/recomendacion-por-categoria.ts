import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Recomendacionservice } from '../../services/recomendacionservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recomendacion-por-categoria',
  standalone: true,
  imports: [CommonModule,BaseChartDirective, MatIconModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './recomendacion-por-categoria.html',
  styleUrl: './recomendacion-por-categoria.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class RecomendacionPorCategoria implements OnInit {

  categorias = [
    { value: 'energia', viewValue: 'Energía Eléctrica' },
    { value: 'agua', viewValue: 'Agua Potable' },
    { value: 'gas', viewValue: 'Gas Doméstico' },
    { value: 'internet', viewValue: 'Internet y Telefonía' },
    { value: 'alimentacion', viewValue: 'Alimentación' },
    { value: 'transporte', viewValue: 'Transporte' },
    { value: 'electrodomesticos', viewValue: 'Electrodomésticos' },
    { value: 'mantenimiento', viewValue: 'Mantenimiento del Hogar' },
    { value: 'residuos', viewValue: 'Gestión de Residuos' },
    { value: 'seguridad', viewValue: 'Seguridad del Hogar' },
    { value: 'otros', viewValue: 'Otros' }
  ];

  categoriaSeleccionada: string = '';  

  hasData = false;

  barChartOptions: ChartOptions = { responsive: true };
  barChartType: ChartType = 'bar';
  barChartLegend = true;

  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Recomendaciones por categoría',
      backgroundColor: ['#75ddfc', '#aeacf7', '#fca05d', '#7ed957', '#ff6384']
    }
  ];

  constructor(private rS: Recomendacionservice) {}

  ngOnInit(): void {
    this.hasData = false;
  }

  onCategoriaChange(): void {
  if (!this.categoriaSeleccionada) return;

  this.rS.getCategoria(this.categoriaSeleccionada).subscribe((data) => {
    if (data && data.length > 0) {
      this.hasData = true;
      this.barChartLabels = data.map(x => x.descripcion);
      this.barChartData[0].data = data.map(x => x.idRecomendacion); 

    } else {
      this.hasData = false;
    }
  });
}
}
