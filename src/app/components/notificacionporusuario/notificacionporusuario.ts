import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Notificacionservice } from '../../services/notificacionservice';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notificacionporusuario',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './notificacionporusuario.html',
  styleUrl: './notificacionporusuario.css',
})
export class Notificacionporusuario {
  hasData = false;

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,   
  };

  barChartType: ChartType = 'pie';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

  constructor(private nS: Notificacionservice) {}

  ngOnInit(): void {
    this.nS.getUsuarios().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.usuario);
        this.barChartData = [
          {
            data: data.map(item => item.total),
            label: 'Cantidad total de notificaciones por usuario',
            backgroundColor: [
              '#75ddfcff',
              '#aeacf7ff',
              'rgba(252, 157, 117, 1)'
            ]
          }
        ];
      } else {
        this.hasData = false;
      }
    });
  }
}
