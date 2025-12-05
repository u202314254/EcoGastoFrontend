import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Consumoservice } from '../../services/consumoservice';
import { Metaservice } from '../../services/metaservice';
import Chart from 'chart.js/auto';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {

  usuarioSesion: any;

  ecoScore = 0;
  ahorroMensual = 0;
  metaAhorroMensual = 500;

  consumoPorRecurso: { recurso: string; total: number }[] = [];
  movimientos: any[] = [];

  consumoAnual: number[] = Array(12).fill(0);
  anioActual = new Date().getFullYear();

  topMonth: string = "";
  topYear: number = 0;
  metasPorYear: number = 0;

  // REFERENCIAS DE GRÁFICO
  ecoGaugeChart!: Chart;
  consumoChart!: Chart;

  constructor(
    private consumoService: Consumoservice,
    private metaService: Metaservice
  ) { }

  ngOnInit(): void {
    const sesion = sessionStorage.getItem('usuarioSesion');
    if (sesion) this.usuarioSesion = JSON.parse(sesion);

    this.cargarConsumos();
    this.cargarMetas();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderEcoGauge();
      this.renderGraficoConsumo();
    }, 300);
  }

  // ======================================================
  // CARGAR CONSUMOS
  // ======================================================
  cargarConsumos() {
    this.consumoService.list().subscribe(data => {

      const consumosUsuario = data.filter(c =>
        c.usuario?.idUsuario === this.usuarioSesion.idUsuario
      );

      // ----------------- Ahorro mensual -----------------
      const mesActual = new Date().getMonth();
      const totalMes = consumosUsuario
        .filter(c => new Date(c.fecha).getMonth() === mesActual)
        .reduce((a, b) => a + b.costo, 0);

      this.ahorroMensual = this.metaAhorroMensual - totalMes;

      // ----------------- Consumo por recurso -----------------
      const map = new Map<string, number>();
      consumosUsuario.forEach(c => {
        const r = c.recurso?.nombreRecurso || "Otros";
        map.set(r, (map.get(r) || 0) + c.costo);
      });
      this.consumoPorRecurso = Array.from(map, ([recurso, total]) => ({ recurso, total }));

      // ----------------- Movimientos -----------------
      this.movimientos = consumosUsuario
        .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
        .slice(0, 5);

      // ----------------- Gráfico anual -----------------
      this.consumoAnual = Array(12).fill(0);
      consumosUsuario.forEach(c => {
        const f = new Date(c.fecha);
        if (f.getFullYear() === this.anioActual) {
          this.consumoAnual[f.getMonth()] += c.costo;
        }
      });

      // ----------------- Top Month -----------------
      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Sept", "Oct", "Nov", "Dic"];
      let max = Math.max(...this.consumoAnual);
      let mesIndex = this.consumoAnual.indexOf(max);
      this.topMonth = `${meses[mesIndex]} ${this.anioActual}`;

      // ======================================================
      // 🔥🔥🔥 ECO SCORE (AQUÍ SE AGREGA LÓGICA REAL) 🔥🔥🔥
      // ======================================================

      // 1️⃣ Gasto mes actual
      const mesActual2 = new Date().getMonth();
      const totalActual2 = consumosUsuario
        .filter(c => new Date(c.fecha).getMonth() === mesActual2)
        .reduce((a, b) => a + b.costo, 0);

      // 2️⃣ Gasto mes anterior
      const mesAnterior2 = mesActual2 === 0 ? 11 : mesActual2 - 1;
      const anioAnterior2 = mesActual2 === 0 ? this.anioActual - 1 : this.anioActual;

      const totalAnterior2 = consumosUsuario
        .filter(c => {
          const f = new Date(c.fecha);
          return f.getMonth() === mesAnterior2 && f.getFullYear() === anioAnterior2;
        })
        .reduce((a, b) => a + b.costo, 0);

      // 3️⃣ Variación del consumo
      let scoreVariacion = 50;
      if (totalAnterior2 > 0) {
        const variacion = ((totalAnterior2 - totalActual2) / totalAnterior2) * 100;
        scoreVariacion = Math.min(Math.max(variacion, 0), 100);
      }

      // 4️⃣ Balance por recurso
      let scoreBalance = 100;
      const totalGasto = consumosUsuario.reduce((a, b) => a + b.costo, 0);

      if (totalGasto > 0) {
        this.consumoPorRecurso.forEach(r => {
          const porcentaje = (r.total / totalGasto) * 100;
          if (porcentaje > 50) scoreBalance -= 20;
        });
      }

      // 5️⃣ Metas cumplidas
      const scoreMetas = Math.min(this.metasPorYear * 20, 100);

      // 6️⃣ SCORE FINAL
      this.ecoScore = Math.round(
        (scoreVariacion * 0.5) +
        (scoreBalance * 0.3) +
        (scoreMetas * 0.2)
      );

      setTimeout(() => this.renderEcoGauge(), 100);

      // FIN ECO SCORE
      // ======================================================

      setTimeout(() => this.renderGraficoConsumo(), 200);
    });
  }

  // ======================================================
  // CARGAR METAS
  // ======================================================
  cargarMetas() {
    this.metaService.list().subscribe(data => {
      const metasUsuario = data.filter(m =>
        m.usuario?.idUsuario === this.usuarioSesion.idUsuario
      );

      this.metasPorYear = metasUsuario.length;
      this.topYear = this.anioActual;
    });
  }

  // ======================================================
  // GRÁFICO ECO SCORE
  // ======================================================
  renderEcoGauge() {
    const canvas = document.getElementById('ecoGauge') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.ecoGaugeChart) this.ecoGaugeChart.destroy();

    this.ecoGaugeChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Progreso', 'Restante'],
        datasets: [{
          data: [this.ecoScore, 100 - this.ecoScore],
          backgroundColor: ['#00d26a', '#e0e0e0'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }

  // ======================================================
  // GRÁFICO MI CONSUMO
  // ======================================================
  renderGraficoConsumo() {
    const canvas = document.getElementById('graficoAnual') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.consumoChart) this.consumoChart.destroy();

    this.consumoChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        datasets: [{
          label: 'Consumo',
          data: this.consumoAnual,
          borderColor: '#32cd32',
          backgroundColor: 'rgba(50,205,50,0.25)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

}
