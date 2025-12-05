
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Seguridad } from '../../../models/Seguridad';
import { Seguridadservice } from '../../../services/seguridadservice';

@Component({
    selector: 'app-seguridadinsertar',
    imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule   ],
    templateUrl: './seguridadinsertar.html',
    providers: [provideNativeDateAdapter()],
    styleUrl: './seguridadinsertar.css',
})
export class Seguridadinsertar implements OnInit {
    form: FormGroup = new FormGroup({});
    seguridad: Seguridad = new Seguridad();
    edicion: boolean = false;
    id: number = 0;
    today: Date = new Date();
    listaUsuarios: Usuario[] = [];

    constructor(
    private sS: Seguridadservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private uS: Usuarioservice,
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
        ultimoLo: ['', Validators.required],
        ip: ['', [Validators.required, Validators.maxLength(50)]],
        intentos: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });
    }

    aceptar(): void {
    if (this.form.valid) {
        this.seguridad.idSeguridad = this.form.value.codigo;
        this.seguridad.usuario.idUsuario = this.form.value.FKUsuario;
        this.seguridad.ultimoLogin = this.form.value.ultimoLo;
        this.seguridad.ipDispositivos = this.form.value.ip;
        this.seguridad.intentosFallidos = this.form.value.intentos;

    if (this.edicion) {
        this.sS.update(this.seguridad).subscribe(() => {
            this.sS.list().subscribe((data) => {
            this.sS.setList(data);
            });
        });
        } else {
        this.sS.insert(this.seguridad).subscribe((data) => {
            this.sS.list().subscribe((data) => {
            this.sS.setList(data);
            });
        });
        }
    this.router.navigate(['seguridades']);
    }
} 

    init() {
    if (this.edicion) {
        this.sS.listId(this.id).subscribe(data => {
        this.form = new FormGroup({
        codigo: new FormControl(data.idSeguridad),
        FKUsuario: new FormControl(data.usuario.idUsuario),
        ultimoLo: new FormControl(data.ultimoLogin),
        ip: new FormControl(data.ipDispositivos),
        intentos: new FormControl(data.intentosFallidos),
        });
        });
    }
    }
}