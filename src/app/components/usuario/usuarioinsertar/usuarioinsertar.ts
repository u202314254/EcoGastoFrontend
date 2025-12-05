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
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Hogar } from '../../../models/Hogar';
import { Hogarservice } from '../../../services/hogarservice';
import { customEmailValidator } from '../../validator';

@Component({
  selector: 'app-usuarioinsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './usuarioinsertar.html',
  styleUrl: './usuarioinsertar.css',
})
export class Usuarioinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  edicion: boolean = false;
  id: number = 0;
  listaHogares: Hogar[] = [];

  constructor(
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private hS: Hogarservice
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
    this.hS.list().subscribe((data) => {
      this.listaHogares = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      FKHogar: ['', Validators.required],
      nombre: ['', Validators.required],
      correoele: ['', [Validators.required, customEmailValidator()]],
      contra: ['', Validators.required],
      estad: [false, Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.usuario.idUsuario = this.form.value.codigo;
      this.usuario.hogar.idHogar = this.form.value.FKHogar;
      this.usuario.username = this.form.value.nombre;
      this.usuario.correo = this.form.value.correoele;
      this.usuario.password = this.form.value.contra;
      this.usuario.estado = this.form.value.estad;

      if (this.edicion) {
        this.uS.update(this.usuario).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
        });
      } else {
        this.uS.insert(this.usuario).subscribe((data) => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
        });
      }

      this.router.navigate(['usuarios']);
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idUsuario),
          FKHogar: new FormControl(data.hogar.idHogar),
          nombre: new FormControl(data.username),
          correoele: new FormControl(data.correo),
          contra: new FormControl(data.password),
          estad: new FormControl(data.estado),
        });
      });
    }
  }
}
