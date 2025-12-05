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
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Insignia } from '../../../models/Insignia';
import { Insigniaservice } from '../../../services/insigniaservice';
import { MatRadioModule } from '@angular/material/radio';
import { Meta } from '../../../models/Meta';
import { Metaservice } from '../../../services/metaservice';

@Component({
  selector: 'app-insigniainsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule 
  ],
  templateUrl: './insigniainsertar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './insigniainsertar.css',
})
export class Insigniainsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  ins: Insignia = new Insignia();
  edicion: boolean = false;
  id: number = 0;
  listaMetas: Meta[] = [];

  logros: { value: string; viewValue: string }[] = [
  { value: 'guardian-del-enchufe', viewValue: 'Guardián del Enchufe' },
  { value: 'ninja-del-grifo', viewValue: 'Ninja del Grifo' },
  { value: 'cazador-de-kilowatts', viewValue: 'Cazador de Kilowatts' },
  { value: 'equipo-ahorro-activado', viewValue: 'Equipo Ahorro Activado' },
  { value: 'economizador-elite', viewValue: 'Economizador Élite' },
  { value: 'hogar-en-modo-leyenda', viewValue: 'Hogar en Modo Leyenda' }
];
  constructor(
    private iS: Insigniaservice,
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
    this.form = this.formBuilder.group({
      codigo: [''],
      FKMeta: ['', Validators.required],
      Nombre_logro: ['', [Validators.required, Validators.maxLength(80)]],
      Descripcion: ['', Validators.required],
      Puntos: ['', [Validators.required, Validators.min(0), Validators.max(10000)]],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.ins.idInsignia = this.form.value.codigo;
      this.ins.meta.idMeta = this.form.value.FKMeta;
      this.ins.nombre_logro = this.form.value.Nombre_logro;
      this.ins.descripcion = this.form.value.Descripcion;
      this.ins.puntos = this.form.value.Puntos;

      if (this.edicion) {
        this.iS.update(this.ins).subscribe(() => {
          this.iS.list().subscribe((data) => {
            this.iS.setList(data);
          });
        });
      } else {
        this.iS.insert(this.ins).subscribe((data) => {
          this.iS.list().subscribe((data) => {
            this.iS.setList(data);
          });
        });
      }

      this.router.navigate(['insignias']);
    }
  }

  init() {
    if (this.edicion) {
      this.iS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idInsignia),
          FKMeta: new FormControl(data.meta.idMeta),
          Nombre_logro: new FormControl(data.nombre_logro),
          Descripcion: new FormControl(data.descripcion),
          Puntos: new FormControl(data.puntos),
        });
      });
    }
  }
}
