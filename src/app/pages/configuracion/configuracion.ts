import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Perfilservice } from '../../services/perfilservice';
import { Hogarservice } from '../../services/hogarservice';
import { Usuarioservice } from '../../services/usuarioservice';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {
  form: FormGroup = new FormGroup({});
  idUsuarioLogeado: number = 0;
  idPerfilEncontrado: number = 0;
  idHogarEncontrado: number = 0;
  constructor(
    private pS: Perfilservice,
    private hS: Hogarservice,
    private uS: Usuarioservice,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    const sesion = sessionStorage.getItem('usuarioSesion');
    if (sesion) {
      const usuario = JSON.parse(sesion);
      this.idUsuarioLogeado = usuario.idUsuario;
      this.cargarDatos();
    } else {
      this.router.navigate(['/login']);
    }
  }
  initForm() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombre: [''],
      edad: [''],
      genero: [''],
      telefono: [''],
      distrito: [''],
      ubicacion: [''],
      tipohogar: [''],
      numpersonas: [''],
    });
  }
  cargarDatos() {
    // 1. Pedimos los datos del Usuario (él tiene la llave de la casa)
    this.uS.listId(this.idUsuarioLogeado).subscribe((u: any) => {
      console.log('DATA USUARIO LLEGANDO:', u); // <--- IMPORTANTE: Mira esto en la consola

      // A) Llenamos datos básicos
      this.form.patchValue({
        username: u.username,
        correo: u.correo,
      });

      // B) Llenamos datos del Hogar DIRECTAMENTE desde el usuario
      if (u.hogar) {
        this.idHogarEncontrado = u.hogar.idHogar; // Guardamos el ID para editar luego
        this.form.patchValue({
          distrito: u.hogar.distrito,
          ubicacion: u.hogar.ubicacion,
          tipohogar: u.hogar.tipohogar,
          numpersonas: u.hogar.numpersonas,
        });
      } else {
        console.warn('El usuario tiene id_hogar en BD, pero Java no devolvió el objeto "hogar".');
      }
    });

    // 2. Llenamos datos del PERFIL (Esto lo dejamos igual porque funciona)
    this.pS.list().subscribe((perfiles: any[]) => {
      const perfil = perfiles.find((p) => p.usuario?.idUsuario === this.idUsuarioLogeado);
      if (perfil) {
        this.idPerfilEncontrado = perfil.idPerfil;
        this.form.patchValue({
          nombre: perfil.nombre,
          edad: perfil.edad,
          genero: perfil.genero,
          telefono: perfil.telefono,
        });
      }
    });
  }
  aceptar() {
    if (this.form.valid) {
      // 1. PREPARAMOS EL USUARIO (Con el correo nuevo)
      // Usamos 'as any' para meter el correo a la fuerza, esperando que el backend lo tome.
      const usuarioPayload = {
        idUsuario: this.idUsuarioLogeado,
        correo: this.form.value.correo,
      } as any;

      // 2. ACTUALIZAR PERFIL
      // Asumimos que el perfil YA EXISTE (según tus instrucciones)
      const perfil = {
        idPerfil: this.idPerfilEncontrado,
        nombre: this.form.value.nombre,
        edad: this.form.value.edad,
        genero: this.form.value.genero,
        telefono: this.form.value.telefono, // Dato obligatorio por interfaz
        usuario: usuarioPayload, // <--- AQUÍ enviamos el correo
      };

      this.pS.update(perfil).subscribe(() => {
        console.log('Perfil actualizado (nombre, edad, etc)');
        // OJO: Si el correo no cambia aquí, es porque tu Java separa Perfil de Usuario.
        // En ese caso, necesitarías descomentar la línea de abajo:
        // this.uS.update(usuarioPayload).subscribe();
      });

      // 3. LOGICA HOGAR (Híbrida: Actualizar si existe, Crear si no)
      const hogar = {
        idHogar: this.idHogarEncontrado, // Si es 0, creará. Si tiene número, actualizará.
        distrito: this.form.value.distrito,
        ubicacion: this.form.value.ubicacion,
        tipohogar: this.form.value.tipohogar,
        numpersonas: this.form.value.numpersonas,
        usuario: usuarioPayload,
      };

      if (this.idHogarEncontrado > 0) {
        // CASO ACTUALIZAR
        this.hS.update(hogar).subscribe(() => {
          console.log('Hogar actualizado correctamente');
        });
      } else {
        // CASO CREAR (Primera vez)
        this.hS.insert(hogar).subscribe((data: any) => {
          console.log('Hogar creado por primera vez');

          // --- EL TRUCO IMPORTANTE ---
          // Si el backend nos devuelve el objeto creado, guardamos su ID.
          // Así, si le das click de nuevo, ya no crea otro, sino que actualiza este.
          if (data && data.idHogar) {
            this.idHogarEncontrado = data.idHogar;
          }
        });
      }
      this.snackBar.open('Se ha actualizado correctamente.', 'OK', {
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    }
  }
}
