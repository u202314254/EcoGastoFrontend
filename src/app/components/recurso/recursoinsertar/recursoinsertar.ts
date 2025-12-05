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
import { MatRadioModule } from '@angular/material/radio';
import { Recurso } from '../../../models/Recurso';
import { Recursoservice } from '../../../services/recursoservice';

@Component({
  selector: 'app-recursoinsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule 
  ],
  templateUrl: './recursoinsertar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './recursoinsertar.css',
})
export class Recursoinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  rec: Recurso = new Recurso();

  edicion: boolean = false;
  id: number = 0;
  tiporecurso: { value: string; viewValue: string }[] = [
    { value: 'Luz ⚡', viewValue: 'Luz ⚡' },
    { value: 'Agua 💧', viewValue: 'Agua 💧' },
    { value: 'Gas 🔥', viewValue: 'Gas 🔥' }
  ];
  constructor(
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

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', Validators.required],
    });

}

  aceptar(): void {
    if (this.form.valid) {
      this.rec.idRecurso = this.form.value.codigo;
      this.rec.nombreRecurso = this.form.value.nombre;

      if (this.edicion) {
        this.rS.update(this.rec).subscribe(() => {
          this.rS.list().subscribe((data) => this.rS.setList(data));
        });
      } else {
        this.rS.insert(this.rec).subscribe(() => {
          this.rS.list().subscribe((data) => this.rS.setList(data));
        });
      }

      this.router.navigate(['recursos']);
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idRecurso),
          nombre: new FormControl(data.nombreRecurso),
        });
      });
    }
  }
}