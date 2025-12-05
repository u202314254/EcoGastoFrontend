
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Notificacion } from '../../../models/Notificacion';
import { Notificacionservice } from '../../../services/notificacionservice';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/Usuario'; 
import { Usuarioservice } from '../../../services/usuarioservice';

@Component({
  selector: 'app-notificacioninsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule   ],
  templateUrl: './notificacioninsertar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './notificacioninsertar.css',
})
export class Notificacioninsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  notificacion: Notificacion = new Notificacion();
  edicion: boolean = false;
  id: number = 0;
  today: Date = new Date();
  listaUsuarios: Usuario[] = [];

  constructor(
    private nS: Notificacionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice
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
    this.form = this.formBuilder.group({
      codigo: [''],
      FKUsuario: ['', Validators.required],
      Titulo: ['', [Validators.required, Validators.maxLength(50)]],
      Descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      Fecha: ['', Validators.required],
      Leido: [false, Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.notificacion.idNotificacion = this.form.value.codigo;
      this.notificacion.usuario.idUsuario = this.form.value.FKUsuario;
      this.notificacion.titulo = this.form.value.Titulo;
      this.notificacion.descripcion = this.form.value.Descripcion;
      this.notificacion.fecha = this.form.value.Fecha;
      this.notificacion.leido = this.form.value.Leido;

      if (this.edicion) {
        this.nS.update(this.notificacion).subscribe(() => {
          this.nS.list().subscribe((data) => {
            this.nS.setList(data);
          });
        });
      } else {
        this.nS.insert(this.notificacion).subscribe((data) => {
          this.nS.list().subscribe((data) => {
            this.nS.setList(data);
          });
        });
      }

      this.router.navigate(['notificaciones']);
    }
  } 

  init() {
    if (this.edicion) {
      this.nS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idNotificacion),
          FKUsuario: new FormControl(data.usuario.idUsuario),
          Titulo: new FormControl(data.titulo),
          Descripcion: new FormControl(data.descripcion),
          Fecha: new FormControl(data.fecha),
          Leido: new FormControl(data.leido)
        });
      });
    }
  }
}