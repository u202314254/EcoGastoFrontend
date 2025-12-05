import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Notificacion } from '../../../models/Notificacion';
import { Notificacionservice } from '../../../services/notificacionservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notificacionlistar',
    imports: [MatTableModule,RouterLink, MatIconModule, CommonModule, MatCardModule, MatPaginatorModule],
    templateUrl: './notificacionlistar.html',
    styleUrl: './notificacionlistar.css',
})
export class Notificacionlistar implements OnInit {
    dataSource: MatTableDataSource<Notificacion> = new MatTableDataSource<Notificacion>();
    displayedColumns: string[] = ['c1','c2','c3','c4','c5','c6','c7','c8'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private nS: Notificacionservice, private uS:Usuarioservice) {}

    ngOnInit(): void {
        this.nS.list().subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
        });
        this.nS.getList().subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
        });
    }   

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    }
    eliminar(id: number) {
        this.nS.delete(id).subscribe(() => {
            this.nS.list().subscribe(data => this.nS.setList(data));
        });
    }
}
