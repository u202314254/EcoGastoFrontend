import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Meta } from '../../../models/Meta';
import { Metaservice } from '../../../services/metaservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Recursoservice } from '../../../services/recursoservice';
import { Usuario } from '../../../models/Usuario';
import { Recurso } from '../../../models/Recurso';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-metainsertar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './metainsertar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './metainsertar.css',
})
export class Metainsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  meta: Meta = new Meta();
  edicion: boolean = false;
  id: number = 0;
  listaUsuarios: Usuario[] = [];
  listaRecursos: Recurso[] = [];
  today: Date = new Date();

  constructor(
    private mS: Metaservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private rS: Recursoservice
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });
    this.rS.list().subscribe((data) => {
      this.listaRecursos = data;
    });
    this.form = this.formBuilder.group(
      {
        codigo: [''],
        FKUsuario: ['', Validators.required],
        FKRecurso: ['', Validators.required],
        Nombre: ['', [Validators.required, Validators.maxLength(50)]],
        Estado: [false, Validators.required],
        Fechainicio: ['', Validators.required],
        Fechafin: ['', Validators.required],
        Progreso: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      },
      {
        validators: [
          (form: AbstractControl) => {
            const inicio = form.get('Fechainicio')?.value;
            const fin = form.get('Fechafin')?.value;
            if (!inicio || !fin) return null;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const inicioDate = new Date(inicio);
            const finDate = new Date(fin);

            if (inicioDate < today) {
              form.get('Fechainicio')?.setErrors({ fechaPasada: true });
            }

            if (finDate < inicioDate) {
              form.get('Fechafin')?.setErrors({ menorQueInicio: true });
            }
            return null;
          },
        ],
      });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.meta.idMeta = this.form.value.codigo;
      this.meta.usuario.idUsuario = this.form.value.FKUsuario;
      this.meta.recurso.idRecurso = this.form.value.FKRecurso;
      this.meta.nombre = this.form.value.Nombre;
      this.meta.estado = this.form.value.Estado;
      this.meta.fechainicio = this.form.value.Fechainicio;
      this.meta.fechafin = this.form.value.Fechafin;
      this.meta.progreso = this.form.value.Progreso;

      if (this.edicion) {
        this.mS.update(this.meta).subscribe(() => {
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
          });
        });
      } else {
        this.mS.insert(this.meta).subscribe((data) => {
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
          });
        });
      }

      this.router.navigate(['metas']);
    }
  }

  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idMeta),
          FKUsuario: new FormControl(data.usuario.idUsuario),
          FKRecurso: new FormControl(data.recurso.idRecurso),
          Nombre: new FormControl(data.nombre),
          Estado: new FormControl(data.estado),
          Fechainicio: new FormControl(data.fechainicio),
          Fechafin: new FormControl(data.fechafin),
          Progreso: new FormControl(data.progreso),
        });
      });
    }
  }
}
