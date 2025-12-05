import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Notificacionservice } from '../../services/notificacionservice';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { NotificacionNoLeidaDTO } from '../../models/NotificacionNoLeidaDTO';

@Component({
  selector: 'app-notificacionnoleida',
  imports: [MatTableModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './notificacionnoleida.html',
  styleUrl: './notificacionnoleida.css',
})
export class Notificacionnoleida implements OnInit {

  dataSource: MatTableDataSource<NotificacionNoLeidaDTO> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

  usuarioSesion: any;

  constructor(private nS: Notificacionservice) { }

  ngOnInit(): void {

    const sesion = sessionStorage.getItem("usuarioSesion");
    if (sesion) this.usuarioSesion = JSON.parse(sesion);

    this.nS.list().subscribe(data => {

      const notificacionesUsuario = data.filter(n =>
        n.usuario?.idUsuario === this.usuarioSesion.idUsuario
      );

      const noLeidas = notificacionesUsuario.filter(n => n.leido === false);

      const dtoList: NotificacionNoLeidaDTO[] = noLeidas.map(n => ({
        idNotificacion: n.idNotificacion,
        titulo: n.titulo,
        descripcion: n.descripcion,
        fecha: n.fecha,
        leido: n.leido
      }));

      this.dataSource = new MatTableDataSource(dtoList);
    });
  }
}
