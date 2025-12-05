import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Notificacionservice } from '../../services/notificacionservice';

@Component({
  selector: 'app-misnotificaciones',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './misnotificaciones.html',
  styleUrls: ['./misnotificaciones.css'],
})
export class Misnotificaciones implements OnInit {

  listaNotificaciones: any[] = [];
  usuarioSesion: any;

  constructor(private nS: Notificacionservice) { }

  ngOnInit() {
    const sesion = sessionStorage.getItem('usuarioSesion') || localStorage.getItem('usuarioSesion');
    if (sesion) this.usuarioSesion = JSON.parse(sesion);
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.nS.list().subscribe(data => {
      this.listaNotificaciones = data;
    });
    this.nS.list().subscribe((data) => {
      this.listaNotificaciones = data.filter(notis =>
        notis.usuario &&
        notis.usuario.idUsuario === this.usuarioSesion.idUsuario
      );
    });
  }

  eliminar(id: number) {
    this.nS.delete(id).subscribe(() => {
      this.cargarNotificaciones();
    });
  }

  toggleLeido(notificacion: any) {
    const actualizado = {
      ...notificacion,
      leido: !notificacion.leido
    };

    this.nS.update(actualizado).subscribe(() => {
      this.cargarNotificaciones();
    });
  }
}
