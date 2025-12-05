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
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Recomendacion } from '../../../models/Recomendacion';
import { Recomendacionservice } from '../../../services/recomendacionservice';
import { MatRadioModule } from '@angular/material/radio';
import { Meta } from '../../../models/Meta';
import { Metaservice } from '../../../services/metaservice';

@Component({
  selector: 'app-recomendacioninsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './recomendacioninsertar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './recomendacioninsertar.css',
})
export class Recomendacioninsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  rec: Recomendacion = new Recomendacion();
  edicion: boolean = false;
  id: number = 0;
  today: Date = new Date();
  listaMetas: Meta[] = [];

  categorias: { value: string; viewValue: string }[] = [
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

  constructor(
    private rS: Recomendacionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private mS: Metaservice
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.mS.list().subscribe((data) => {
      this.listaMetas = data;
    });
    this.form = this.formBuilder.group(
      {
        codigo: [''],
        FKMeta: ['', Validators.required],
        Descripcion: ['', [Validators.required, Validators.maxLength(300)]],
        Categoria: ['', [Validators.required, Validators.maxLength(200)]],
        Fechapublicacion: ['', Validators.required,],
        Fuente: ['', [Validators.required, Validators.maxLength(200)]],
      },
      {
        validators: [
          (form: AbstractControl) => {
            const idMeta = form.get('FKMeta')?.value;
            const fechaPub = form.get('Fechapublicacion')?.value;

            if (!idMeta || !fechaPub) return null;
            const metaSeleccionada = this.listaMetas.find(m => m.idMeta === idMeta);
            if (!metaSeleccionada) return null;

            const fechaInicioMeta = new Date(metaSeleccionada.fechainicio);
            const fechaPublicacion = new Date(fechaPub);

            if (fechaPublicacion < fechaInicioMeta) {
              form.get('Fechapublicacion')?.setErrors({ menorQueMeta: true });
            }

            return null;
          }
        ]
      }
    );
  }

  aceptar(): void {
    if (this.form.valid) {
      this.rec.idRecomendacion = this.form.value.codigo;
      this.rec.meta.idMeta = this.form.value.FKMeta;
      this.rec.descripcion = this.form.value.Descripcion;
      this.rec.categoria = this.form.value.Categoria;
      this.rec.fechapublicacion = this.form.value.Fechapublicacion;
      this.rec.fuente = this.form.value.Fuente;

      if (this.edicion) {
        this.rS.update(this.rec).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      } else {
        this.rS.insert(this.rec).subscribe((data) => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
        });
      }

      this.router.navigate(['recomendaciones']);
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idRecomendacion),
          FKMeta: new FormControl(data.meta.idMeta),
          Descripcion: new FormControl(data.descripcion),
          Categoria: new FormControl(data.categoria),
          Fechapublicacion: new FormControl(data.fechapublicacion),
          Fuente: new FormControl(data.fuente),
        });
      });
    }
  }
}
