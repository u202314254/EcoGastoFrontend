import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { CantidadMetaActivaDTO } from '../../models/CantidadMetaActivaDTO';
import { Metaservice } from '../../services/metaservice';

@Component({
  selector: 'app-metasincompletas',
  imports: [MatTableModule, CommonModule, MatIconModule, RouterLink],
  templateUrl: './metasincompletas.html',
  styleUrl: './metasincompletas.css',
})
export class Metasincompletas implements OnInit {

  dataSource: MatTableDataSource<CantidadMetaActivaDTO> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

  usuarioSesion!: any;

  constructor(private mS: Metaservice) { }

  ngOnInit(): void {
    const sesion = sessionStorage.getItem("usuarioSesion");
    if (sesion) this.usuarioSesion = JSON.parse(sesion);

    this.mS.list().subscribe(data => {

      const metasUsuario = data.filter(m =>
        m.usuario?.idUsuario === this.usuarioSesion.idUsuario
      );

      const incompletas = metasUsuario.filter(m => m.estado === false);

      const dtoList = incompletas.map(m => {
        return {
          idMeta: m.idMeta,
          fechaInicio: m.fechainicio,
          fechaFin: m.fechafin,
          estado: m.estado
        };
      });

      this.dataSource = new MatTableDataSource(dtoList);
    });
  }
}
