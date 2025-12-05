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
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Rol } from '../../../models/Rol';
import { Rolservice } from '../../../services/rolservice';

@Component({
    selector: 'app-rolinsertar',
    imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    ],
    templateUrl: './rolinsertar.html',
    styleUrl: './rolinsertar.css',
})
export class Rolinsertar implements OnInit {
    form: FormGroup = new FormGroup({});
    rol: Rol = new Rol();
    edicion: boolean = false;
    id: number = 0;
    listaUsuarios: Usuario[] = [];

    tipo: { value: string; viewValue: string }[] = [
    { value: 'ADMIN', viewValue: 'ADMIN' },
    { value: 'CLIENT', viewValue: 'CLIENT' },
    ];

    constructor(
    private rS: Rolservice,
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
    })

    this.form = this.formBuilder.group({
        codigo: [''],
        Tipo: ['', Validators.required],
        FKUsuario: ['', Validators.required],
    });
    }

    aceptar(): void {
    if (this.form.valid) {
        this.rol.id = this.form.value.codigo;
        this.rol.tipo = this.form.value.Tipo;
        this.rol.usuario.idUsuario = this.form.value.FKUsuario;

    if (this.edicion) {
        this.rS.update(this.rol).subscribe(() => {
            this.rS.list().subscribe((data) => {
            this.rS.setList(data);
        });
        });
    } else {
        this.rS.insert(this.rol).subscribe((data) => {
            this.rS.list().subscribe((data) => {
            this.rS.setList(data);
        });
        });
    }

    this.router.navigate(['roles']);
    }
    }

init() {
    if (this.edicion) {
        this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
            codigo: new FormControl(data.id),
            Tipo: new FormControl(data.tipo),
            FKUsuario: new FormControl(data.usuario.idUsuario),
        });
        });
    }
    }
}
