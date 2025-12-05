// 1. AGREGA ViewChild A LOS IMPORTS
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, debounceTime, switchMap, of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

import { MatStepperModule, MatStepper } from '@angular/material/stepper';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Hogar } from '../../models/Hogar';
import { Usuario } from '../../models/Usuario';
import { Perfil } from '../../models/Perfil';
import { Hogarservice } from '../../services/hogarservice';
import { Usuarioservice } from '../../services/usuarioservice';
import { Perfilservice } from '../../services/perfilservice';
import { customEmailValidator } from '../../components/validator';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatStepperModule,
    MatSnackBarModule,
    RouterLink,
    MatDatepickerModule,
    MatFormFieldModule
  ],
  templateUrl: './Registrar.html',
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./Registrar.css'],
})
export class Registrar implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;

  formHogar!: FormGroup;
  formCuenta!: FormGroup;
  formPerfil!: FormGroup;

  hogarCreado: Hogar | null = null;
  usuarioCreado: Usuario | null = null;

 today: Date = new Date();

  listaHogares: Hogar[] = [];
  ubicaciones$ = new BehaviorSubject<any[]>([]);

  map!: L.Map;
  marker!: L.Marker;
  private mapInitialized = false;

  constructor(
    private fb: FormBuilder,
    private hogarService: Hogarservice,
    private usuarioService: Usuarioservice,
    private perfilService: Perfilservice,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formHogar = this.fb.group({
      distrito: ['', [Validators.required, Validators.maxLength(60)]],
      ubicacion: ['', [Validators.required, Validators.maxLength(500)]],
      tipohogar: ['', [Validators.required, Validators.maxLength(50)]],
      numpersonas: [1, [Validators.required, Validators.min(1)]],
    });

    this.formCuenta = this.fb.group({
      correo: ['', [Validators.required, Validators.maxLength(50), customEmailValidator()]],
      username: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(8)]],
      hogar: ['', Validators.required],
    });

    this.formPerfil = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      edad: ['', Validators.required],
      genero: ['', [Validators.required, Validators.maxLength(50)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    }, {
        validators: [
          (form: AbstractControl) => {
            const inicio = form.get('Fechainicio')?.value;
            const fin = form.get('Fechafin')?.value;
            if (!inicio || !fin) return null;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const inicioDate = new Date(inicio);
            const finDate = new Date(fin);

            if (inicioDate < today) {
              form.get('Fechainicio')?.setErrors({ fechaPasada: true });
            }

            if (finDate < inicioDate) {
              form.get('Fechafin')?.setErrors({ menorQueInicio: true });
            }
            return null;
          },
        ],
      });

    this.hogarService.list().subscribe((lista) => (this.listaHogares = lista));
  }

  ngAfterViewInit(): void {
    setTimeout(() =>  this.initializeMap(), 200);
  }

  // MAPA
  private initializeMap(): void {
    if (this.mapInitialized) return;

    this.map = L.map('map').setView([-12.031747, -77.0012], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.seleccionarUbicacionDesdeMapa(e.latlng.lat, e.latlng.lng);
    });

    this.mapInitialized = true;
  }

  seleccionarUbicacionDesdeMapa(lat: number, lon: number) {
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lon]).addTo(this.map);

    this.reverseGeocode(lat, lon);
  }

  reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=es`;

    this.http.get<any>(url).subscribe((data) => {
      if (!data) return;

      const address = data.address || {};

      // UBICACIÓN COMPLETA
      if (data.display_name) {
        this.formHogar.patchValue({ ubicacion: data.display_name });
      }

      // OBTENER DISTRITO DESDE EL MAPA
      let distrito =
        address.suburb ||
        address.neighbourhood ||
        address.city_district ||
        address.county ||
        address.city ||
        address.town ||
        address.village ||
        '';

      this.formHogar.patchValue({ distrito });
    });
  }

  // SIGUIENTE — REGISTRAR HOGAR
  siguiente() {
    if (this.formHogar.invalid) {
      this.formHogar.markAllAsTouched();
      this.snackBar.open('Completa todos los datos del hogar.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }

    const hogar: Hogar = {
      idHogar: 0,
      distrito: this.formHogar.value.distrito,
      ubicacion: this.formHogar.value.ubicacion,
      tipohogar: this.formHogar.value.tipohogar,
      numpersonas: this.formHogar.value.numpersonas,
    };

    this.hogarService.insert(hogar).subscribe((h) => {
      this.hogarCreado = h;

      this.snackBar.open('Hogar registrado correctamente.', 'OK', {
        duration: 2500,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });

      this.hogarService.list().subscribe((lista) => {
        this.listaHogares = lista;
        this.stepper.next();
      });
    });
  }

  // REGISTRAR USUARIO
  registrarUsuario() {
    if (this.formCuenta.invalid) {
      this.formCuenta.markAllAsTouched();
      this.snackBar.open('Completa los datos de tu cuenta.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }

    let idHogar = this.formCuenta.value.hogar;
    if (!idHogar && this.hogarCreado) idHogar = this.hogarCreado.idHogar;

    const hogarSeleccionado = this.listaHogares.find((h) => h.idHogar === +idHogar);

    if (!hogarSeleccionado) {
      this.snackBar.open('Debes seleccionar un hogar válido.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }

    const usuario: Usuario = {
      idUsuario: 0,
      estado: true,
      hogar: hogarSeleccionado,
      correo: this.formCuenta.value.correo,
      username: this.formCuenta.value.username,
      password: this.formCuenta.value.password,
    };

    this.usuarioService.insert(usuario).subscribe(() => {
      this.usuarioService.list().subscribe((lista) => {
        const encontrado = lista.find((u) => u.correo === usuario.correo);

        if (encontrado) {
          this.usuarioCreado = encontrado;

          this.snackBar.open('Usuario creado correctamente.', 'OK', {
            duration: 2500,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.stepper.next();
        }
      });
    });
  }

  // REGISTRAR PERFIL FINAL
  registrar() {
    if (this.formPerfil.invalid || !this.usuarioCreado) {
      this.snackBar.open('Completa los datos del perfil.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
      return;
    }

    const perfil: Perfil = {
      idPerfil: 0,
      nombre: this.formPerfil.value.nombre,
      edad: this.formPerfil.value.edad,
      genero: this.formPerfil.value.genero,
      telefono: this.formPerfil.value.telefono,
      usuario: this.usuarioCreado,
    };

    this.perfilService.insert(perfil).subscribe(() => {
      this.snackBar.open('¡Registro completo! Ya puedes iniciar sesión.', 'OK', {
        duration: 3500,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });

      this.router.navigate(['login']);
    });
  }
}
