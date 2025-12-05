import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Hogar } from '../../../models/Hogar';
import { Hogarservice } from '../../../services/hogarservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-hogarinsetar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './hogarinsertar.html',
  styleUrl: './hogarinsertar.css',
})
export class Hogarinsetar implements OnInit {
  form: FormGroup = new FormGroup({});
  hogar: Hogar = new Hogar();
  

  edicion: boolean = false;
  id: number = 0;
  tipohogar: { value: string; viewValue: string }[] = [
    { value: 'Departamento', viewValue: 'Departamento' },
    { value: 'Casa', viewValue: 'Casa' }
  ];
  constructor(
    private hS: Hogarservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      distrito: ['', [Validators.required, Validators.maxLength(50)]],
      ubicacion: ['', [Validators.required, Validators.maxLength(500)]],
      tipohogar: ['', [Validators.required, Validators.maxLength(50)]],
      numpersonas: [0, [Validators.required, Validators.min(1)]],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.hogar.idHogar = this.form.value.codigo;
      this.hogar.distrito = this.form.value.distrito;
      this.hogar.ubicacion = this.form.value.ubicacion;
      this.hogar.tipohogar = this.form.value.tipohogar;
      this.hogar.numpersonas = this.form.value.numpersonas;

      if (this.edicion) {
        this.hS.update(this.hogar).subscribe((data) => {
          this.hS.list().subscribe((data) => {
            this.hS.setList(data);
          });
        });
      } else {
        this.hS.insert(this.hogar).subscribe(() => {
          this.hS.list().subscribe((data) => {
            this.hS.setList(data);
          });
        });
      }
      this.router.navigate(['hogares']);
    }
  }

  init() {
    if (this.edicion) {
      this.hS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idHogar),
          distrito: new FormControl(data.distrito),
          ubicacion: new FormControl(data.ubicacion),
          tipohogar: new FormControl(data.tipohogar),
          numpersonas: new FormControl(data.numpersonas),
        });
      });
    }
  }
}
