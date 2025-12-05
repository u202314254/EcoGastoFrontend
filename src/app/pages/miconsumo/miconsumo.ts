import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Consumo } from '../../models/Consumo';
import { Consumoservice } from '../../services/consumoservice';
import { Recursoservice } from '../../services/recursoservice';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-miconsumo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './miconsumo.html',
  styleUrls: ['./miconsumo.css'],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class MiConsumo implements OnInit {

  // ---------------------------
  // FORMULARIO CRUD
  // ---------------------------
  form!: FormGroup;
  mostrarFormulario = false;
  editando = false;
  idConsumoEditando: number | null = null;
  today: Date = new Date();
  listaRecursos: any[] = [];
  usuarioSesion: any;

  // ---------------------------
  // LISTA DE CONSUMOS
  // ---------------------------
  data: Consumo[] = [];
  idUsuario = 0;

  // ---------------------------
  // CHARTS
  // ---------------------------
  @ViewChild('barChart', { read: BaseChartDirective }) barChart?: BaseChartDirective;
  @ViewChild('areaChart', { read: BaseChartDirective }) areaChart?: BaseChartDirective;

  barType: ChartType = 'bar';
  barLabels: string[] = [];
  barData: ChartDataset[] = [];
  barOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  areaType: ChartType = 'line';
  areaLabels: string[] = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];
  areaData: ChartDataset[] = [];
  areaOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  // Filtros
  meses = [
    { id: 1, nombre: 'Enero' }, { id: 2, nombre: 'Febrero' }, { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' }, { id: 5, nombre: 'Mayo' }, { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' }, { id: 8, nombre: 'Agosto' }, { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' }, { id: 11, nombre: 'Noviembre' }, { id: 12, nombre: 'Diciembre' }
  ];
  mesSeleccionado = new Date().getMonth() + 1;

  anios: number[] = [];
  anioSeleccionado = new Date().getFullYear();

  totalMes = 0;
  promedioRecurso = 0;
  variacion = '0%';


  constructor(
    private consumoService: Consumoservice,
    private recursoService: Recursoservice,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) { }

  mostrarSnackbar(mensaje: string) {
    this.snack.open(mensaje, "Cerrar", {
      duration: 2500,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ["snackbar-eco"]
    });
  }

  // ---------------------------
  // INIT
  // ---------------------------
  ngOnInit(): void {

    const sesionRaw = sessionStorage.getItem('usuarioSesion');
    if (sesionRaw) {
      this.usuarioSesion = JSON.parse(sesionRaw);
      this.idUsuario = this.usuarioSesion.idUsuario;
    }

    this.form = this.fb.group({
      FKRecurso: ['', Validators.required],
      Cantidad: ['', [Validators.required, Validators.min(0)]],
      Costo: ['', [Validators.required, Validators.min(0)]],
      Fecha: ['', Validators.required],
      Descripcion: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.cargarRecursos();
    this.cargarDatos();
  }


  // ---------------------------
  // CARGA LISTA
  // ---------------------------
  cargarRecursos() {
    this.recursoService.list().subscribe(r => this.listaRecursos = r);
  }

  cargarDatos() {
    this.consumoService.list().subscribe((resp) => {
      this.data = resp.filter((c) => c.usuario?.idUsuario === this.idUsuario);

      const min = 2020;
      const max = Math.max(
        new Date().getFullYear(),
        ...this.data.map((x) => new Date(x.fecha).getFullYear())
      );

      this.anios = [];
      for (let a = min; a <= max; a++) this.anios.push(a);

      this.actualizarBarChart();
      this.actualizarAreaChart();
    });
  }


  // ---------------------------
  // CRUD - ABRIR/CERRAR FORM
  // ---------------------------
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) this.resetFormulario();
  }

  resetFormulario() {
    this.form.reset();
    this.editando = false;
    this.idConsumoEditando = null;
  }


  // ---------------------------
  // CRUD - GUARDAR
  // ---------------------------
  guardarConsumo() {
    if (this.form.invalid) return;

    const c = new Consumo();
    c.usuario = this.usuarioSesion;
    c.recurso = { idRecurso: this.form.value.FKRecurso } as any;
    c.cantidad = this.form.value.Cantidad;
    c.costo = this.form.value.Costo;
    c.fecha = this.form.value.Fecha;
    c.descripcion = this.form.value.Descripcion;

    if (!this.editando) {
      // ⭐ REGISTRAR
      this.consumoService.insert(c).subscribe(() => {
        this.cargarDatos();
        this.toggleFormulario();
        this.mostrarSnackbar("Consumo registrado");   
      });
    } else {
      // ⭐ ACTUALIZAR
      c.idConsumo = this.idConsumoEditando!;
      this.consumoService.update(c).subscribe(() => {
        this.cargarDatos();
        this.toggleFormulario();
        this.mostrarSnackbar("Consumo actualizado");  
      });
    }
  }

// ---------------------------
// CRUD - EDITAR
// ---------------------------
editarConsumo(c: Consumo) {
  this.editando = true;
  this.idConsumoEditando = c.idConsumo;

  this.form.patchValue({
    FKRecurso: c.recurso.idRecurso,
    Cantidad: c.cantidad,
    Costo: c.costo,
    Fecha: c.fecha,
    Descripcion: c.descripcion
  });

  this.mostrarFormulario = true;
}


// ---------------------------
// CRUD - ELIMINAR
// ---------------------------
eliminarConsumo(id: number) {
  this.consumoService.delete(id).subscribe(() => {
    this.cargarDatos();
    this.mostrarSnackbar("Consumo eliminado");
  });
}


// ---------------------------
// CHARTS
// ---------------------------
actualizarBarChart() {
  const anioActual = this.anioSeleccionado;
  const mes = this.mesSeleccionado - 1;

  const consumos = this.data.filter((c) => {
    const f = new Date(c.fecha);
    return f.getFullYear() === anioActual && f.getMonth() === mes;
  });

  const map = new Map<string, number>();
  consumos.forEach((c) => {
    const r = c.recurso?.nombreRecurso || 'Otros';
    map.set(r, (map.get(r) || 0) + c.costo);
  });

  this.barLabels = [...map.keys()];
  const values = [...map.values()];

  const colores = this.barLabels.map((r) => {
    const nombre = r.trim().toLowerCase();
    if (nombre.includes('luz')) return '#FDD835';
    if (nombre.includes('agua')) return '#4FC3F7';
    if (nombre.includes('gas')) return '#FF7043';
    return '#8cff66';
  });

  this.barData = [
    {
      label: `Consumo en ${this.meses[this.mesSeleccionado - 1].nombre}`,
      data: values,
      backgroundColor: colores,
      borderRadius: 8,
      barThickness: 45,
    },
  ];

  this.totalMes = values.reduce((a, b) => a + b, 0);
  this.promedioRecurso = values.length ? +(this.totalMes / values.length).toFixed(2) : 0;

  const mesAnterior = mes === 0 ? 11 : mes - 1;
  const anioAnterior = mes === 0 ? anioActual - 1 : anioActual;

  const consAnt = this.data.filter((c) => {
    const f = new Date(c.fecha);
    return f.getFullYear() === anioAnterior && f.getMonth() === mesAnterior;
  });

  const totalAnt = consAnt.reduce((a, b) => a + b.costo, 0);

  if (totalAnt > 0) {
    const v = ((this.totalMes - totalAnt) / totalAnt) * 100;
    this.variacion = `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
  } else {
    this.variacion = 'N/A';
  }

  setTimeout(() => this.barChart?.update());
}

actualizarAreaChart() {
  const year = this.anioSeleccionado;
  const totales = Array(12).fill(0);

  this.data.forEach((c) => {
    const f = new Date(c.fecha);
    if (f.getFullYear() === year) totales[f.getMonth()] += c.costo;
  });

  this.areaData = [
    {
      label: `Consumo Anual ${year}`,
      data: [...totales],
      fill: true,
      tension: 0.35,
      backgroundColor: 'rgba(140,255,102,0.25)',
      borderColor: 'rgba(140,255,102,1)',
    },
  ];

  setTimeout(() => this.areaChart?.update());
}

onMesChange() {
  this.actualizarBarChart();
}

onAnioChange() {
  this.actualizarAreaChart();
}
}
