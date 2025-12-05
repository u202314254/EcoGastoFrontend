import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { Consumo } from '../../../models/Consumo';
import { Consumoservice } from '../../../services/consumoservice';
import { Recursoservice } from '../../../services/recursoservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Usuario } from '../../../models/Usuario';
import { Recurso } from '../../../models/Recurso';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-consumoinsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './consumoinsertar.html',
    providers: [provideNativeDateAdapter()],
  styleUrl: './consumoinsertar.css',
})
export class Consumoinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  con: Consumo = new Consumo();
  today: Date = new Date();
  edicion: boolean = false;
  id: number = 0;
  listaUsuarios: Usuario[] = [];
  listaRecursos: Recurso[] = [];


  constructor(
    private cS: Consumoservice,
    private uS: Usuarioservice,
    private rS: Recursoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
      });
      this.uS.list().subscribe(data => {
      this.listaUsuarios = data;
    }); 
          this.rS.list().subscribe(data => {
      this.listaRecursos = data;
      });

    this.form = this.formBuilder.group({ 
      codigo: [''],
      FKUsuario: ['', Validators.required],
      FKRecurso: ['', Validators.required],
      Cantidad: ['', [Validators.required, Validators.min(0)]],
      Costo: ['', [Validators.required, Validators.min(0)]],
      Fecha: ['', Validators.required],
      Descripcion: ['', [Validators.required, Validators.maxLength(200)]],
    }); 
  }

  aceptar(): void {
    if (this.form.valid) {
      this.con.idConsumo = this.form.value.codigo;
      this.con.usuario.idUsuario = this.form.value.FKUsuario;
      this.con.recurso.idRecurso = this.form.value.FKRecurso;
      this.con.cantidad = this.form.value.Cantidad;
      this.con.costo = this.form.value.Costo;
      this.con.fecha = this.form.value.Fecha;
      this.con.descripcion = this.form.value.Descripcion;

      if (this.edicion) {
        this.cS.update(this.con).subscribe(() => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      } else {
        this.cS.insert(this.con).subscribe((data) => {
          this.cS.list().subscribe((data) => {
            this.cS.setList(data);
          });
        });
      }
      this.router.navigate(['consumos']);
    }
  }

  init() {
    if (this.edicion) {
      this.cS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idConsumo),
          FKUsuario: new FormControl(data.usuario.idUsuario),
          FKRecurso: new FormControl(data.recurso.idRecurso), 
          Descripcion: new FormControl(data.descripcion),
          Cantidad: new FormControl(data.cantidad),
          Fecha: new FormControl(data.fecha),
          Costo: new FormControl(data.costo),
        });
      });
    }
  }
}
