import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Metaservice } from '../../services/metaservice';
import { Recursoservice } from '../../services/recursoservice';
import { Usuario } from '../../models/Usuario';
import { Meta } from '../../models/Meta';
import { Recurso } from '../../models/Recurso';

@Component({
  selector: 'app-mismetas',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatSnackBarModule
  ],
  templateUrl: './mismetas.html',
  styleUrl: './mismetas.css',
  providers: [provideNativeDateAdapter()]
})
export class Mismetas implements OnInit {

  metas: Meta[] = [];
  listaRecursos: Recurso[] = [];
  usuarioSesion!: Usuario;

  mostrarFormulario = false;
  editando = false;
  idMetaEditando: number | null = null;

  form!: FormGroup;
  today: Date = new Date();

  constructor(
    private mS: Metaservice,
    private rS: Recursoservice,
    private fb: FormBuilder,
    private snack: MatSnackBar   // <-- AGREGADO
  ) { }

  ngOnInit(): void {

    const sesion = sessionStorage.getItem("usuarioSesion");
    if (sesion) this.usuarioSesion = JSON.parse(sesion);

    this.cargarMetas();
    this.cargarRecursos();

    this.form = this.fb.group({
      Nombre: ['', [Validators.required, Validators.maxLength(50)]],
      FKRecurso: ['', Validators.required],
      Fechainicio: ['', Validators.required],
      Fechafin: ['', Validators.required],
      Progreso: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    }, {
      validators: (form: AbstractControl) => {
        const inicio = form.get('Fechainicio')?.value;
        const fin = form.get('Fechafin')?.value;

        if (!inicio || !fin) return null;

        const inicioDate = new Date(inicio);
        const finDate = new Date(fin);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (inicioDate < hoy) {
          form.get('Fechainicio')?.setErrors({ fechaPasada: true });
        }

        if (finDate < inicioDate) {
          form.get('Fechafin')?.setErrors({ menorQueInicio: true });
        }

        return null;
      }
    });
  }

  // 🔥 SNACKBAR: método para mostrar avisos
  mostrarSnackbar(mensaje: string) {
    this.snack.open(mensaje, 'Cerrar', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-eco']
    });
  }

  cargarMetas() {
    this.mS.list().subscribe(m => {
      this.metas = m.filter(meta =>
        meta.usuario &&
        meta.usuario.idUsuario &&
        meta.usuario.idUsuario === this.usuarioSesion.idUsuario
      );
    });
  }

  cargarRecursos() {
    this.rS.list().subscribe(r => this.listaRecursos = r);
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) this.resetFormulario();
  }

  resetFormulario() {
    this.form.reset();
    this.editando = false;
    this.idMetaEditando = null;
  }

  guardarMeta() {
    if (this.form.invalid) return;

    const meta = new Meta();

    meta.nombre = this.form.value.Nombre;
    meta.usuario = this.usuarioSesion;

    meta.recurso = new Recurso();
    meta.recurso.idRecurso = this.form.value.FKRecurso;

    meta.progreso = this.form.value.Progreso;
    meta.fechainicio = this.form.value.Fechainicio;
    meta.fechafin = this.form.value.Fechafin;

    meta.estado = meta.progreso === 100;

    if (!this.editando) {
      this.mS.insert(meta).subscribe(() => {
        this.cargarMetas();
        this.toggleFormulario();
        this.mostrarSnackbar('Meta registrada correctamente'); // <-- AGREGADO
      });
    } else {
      meta.idMeta = this.idMetaEditando!;
      this.mS.update(meta).subscribe(() => {
        this.cargarMetas();
        this.toggleFormulario();
        this.mostrarSnackbar('Meta actualizada'); // <-- AGREGADO
      });
    }
  }

  editarMeta(meta: Meta) {
    this.editando = true;
    this.idMetaEditando = meta.idMeta;

    this.form.patchValue({
      Nombre: meta.nombre,
      FKRecurso: meta.recurso.idRecurso,
      Fechainicio: meta.fechainicio,
      Fechafin: meta.fechafin,
      Progreso: meta.progreso,
    });

    this.mostrarFormulario = true;
  }

  eliminarMeta(id: number) {
    this.mS.delete(id).subscribe({
      next: () => {
        this.cargarMetas();
        this.mostrarSnackbar('Meta eliminada');  // <-- AGREGADO
      },
      error: () => {
        this.metas = this.metas.filter(m => m.idMeta !== id);
        this.mostrarSnackbar('Meta eliminada localmente'); // fallback
      }
    });
  }
}
