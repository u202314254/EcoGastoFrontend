import { Component, ElementRef, ViewChild } from '@angular/core';
import { Insigniaservice } from '../../services/insigniaservice';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-misinsignias',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './misinsignias.html',
  styleUrl: './misinsignias.css',
})
export class Misinsignias {

  @ViewChild('donutCanvas') donutCanvas!: ElementRef<HTMLCanvasElement>;
  donutChart!: Chart;

  usuarioSesion: any;
  insignias: any[] = [];

  totalInsignias = 0;

  constructor(private iS: Insigniaservice) { }

  ngOnInit(): void {
    const sesion = sessionStorage.getItem("usuarioSesion") || localStorage.getItem("usuarioSesion");
    if (sesion) this.usuarioSesion = JSON.parse(sesion);

    this.iS.list().subscribe((data) => {
      this.insignias = data.filter(ins =>
        ins.meta &&
        ins.meta.usuario &&
        ins.meta.usuario.idUsuario === this.usuarioSesion.idUsuario
      );

      this.totalInsignias = this.insignias.length;

      setTimeout(() => this.renderDonut(), 50);
    });
  }

  renderDonut() {
    let agua = 0, luz = 0, gas = 0;

    this.insignias.forEach(ins => {
      const r = ins.meta?.recurso?.nombreRecurso?.toLowerCase();
      if (!r) return;

      if (r.includes("agua")) agua++;
      else if (r.includes("luz") || r.includes("electricidad")) luz++;
      else if (r.includes("gas")) gas++;
    });

    if (this.donutChart) this.donutChart.destroy();

    this.donutChart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Agua', 'Electricidad', 'Gas'],
        datasets: [
          {
            data: [agua, luz, gas],
            backgroundColor: ['#00a7ff', '#fbc02d', '#e53935'],
            hoverBackgroundColor: ['#0090dd', '#e0a800', '#cc2f2f']
          }
        ]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // ICONOS
  getIcono(recurso: string) {
    if (!recurso) return 'help';
    recurso = recurso.toLowerCase();

    if (recurso.includes('agua')) return 'water_drop';
    if (recurso.includes('gas')) return 'local_fire_department';
    if (recurso.includes('luz') || recurso.includes('electricidad')) return 'bolt';
    return 'eco';
  }

  // COLORES
  getColorIcono(recurso: string) {
    if (!recurso) return '#00a7ff';
    recurso = recurso.toLowerCase();

    if (recurso.includes('agua')) return '#00a7ff';
    if (recurso.includes('gas')) return '#e53935';
    if (recurso.includes('luz') || recurso.includes('electricidad')) return '#fbc02d';
    return '#00a7ff';
  }

}
