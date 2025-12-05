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
import { Perfil } from '../../../models/Perfil';
import { Perfilservice } from '../../../services/perfilservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/Usuario';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-perfilinsertar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './perfilinsertar.html',
  styleUrl: './perfilinsertar.css'
})
export class Perfilinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  perfil: Perfil = new Perfil();
  edicion: boolean = false;
  id: number = 0;
  listaUsuarios: Usuario[] = [];
  today: Date=new Date();

  generos: { value: string; viewValue: string }[] = [
    { value: 'Maculino', viewValue: 'Masculino' },
    { value: 'Femenino', viewValue: 'Femenino' },
  ];
  constructor(
    private pS: Perfilservice,
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
      name: ['', [Validators.required, Validators.maxLength(50)]],
      Edad: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Genero: ['', [Validators.required, Validators.maxLength(50)]],
      Telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]+$')]],
    });
    
  }

  aceptar(): void {
    if (this.form.valid) {
      this.perfil.idPerfil = this.form.value.codigo;
      this.perfil.usuario.idUsuario = this.form.value.FKUsuario;
      this.perfil.nombre = this.form.value.name;
      this.perfil.edad = this.form.value.Edad;
      this.perfil.genero = this.form.value.Genero;
      this.perfil.telefono = this.form.value.Telefono;

      if (this.edicion) {
        this.pS.update(this.perfil).subscribe(() => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
          });
        });
      } else {
        this.pS.insert(this.perfil).subscribe((data) => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
          });
        });
      }

      this.router.navigate(['perfiles']);
    }
  }

  init() {
    if (this.edicion) {
      this.pS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idPerfil),
          FKUsuario: new FormControl(data.usuario.idUsuario),
          name: new FormControl(data.nombre),
          Edad: new FormControl(data.edad),
          Genero: new FormControl(data.genero),
          Telefono: new FormControl(data.telefono),
        });
      });
    }
  }
}
