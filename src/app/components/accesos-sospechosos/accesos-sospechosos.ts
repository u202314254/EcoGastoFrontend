import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Seguridadservice } from '../../services/seguridadservice';

@Component({
  selector: 'app-accesos-sospechosos',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './accesos-sospechosos.html',
  styleUrl: './accesos-sospechosos.css',
  providers: [provideCharts(withDefaultRegisterables())],
})
export class AccesosSospechosos implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
    x: {
      ticks: {
        font: {
          size: 16,
          family: 'Arial' 
        },
        color: '#000' 
      }
    },
    y: {
      ticks: {
        font: {
          size: 16 
        }
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 16
        }
      }
    }
  }
  };
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];

  constructor(private sS: Seguridadservice) {}

  ngOnInit(): void {
    this.sS.accesosSospechosos().subscribe((data) => {
      if (data.length > 0) {
        this.hasData = true;
        this.barChartLabels = data.map((item) => item.ip);
        this.barChartData=[
          {
            data:data.map(item=>item.intentos_fallidos),
            label:'Número de intentos x ip',
            backgroundColor:[
              '#6ae0d1ff',
              '#8ec28dff',
              'rgba(252, 157, 117, 1)'
            ]
          }
        ]
      } else {
        this.hasData = false;
      }
    });
  }
}
