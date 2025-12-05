import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-usuariolistar',
    imports: [MatTableModule,RouterLink, MatIconModule, MatCardModule, MatPaginatorModule],
    templateUrl: './usuariolistar.html',
    styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {
    dataSource:MatTableDataSource<Usuario>=new MatTableDataSource<Usuario>()
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private uS:Usuarioservice) {}

    ngOnInit(): void {
    this.uS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    });
    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    }
    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
      eliminar(id: number) {
    this.uS.delete(id).subscribe(data=>{
      this.uS.list().subscribe(data=>{
        this.uS.setList(data)
      })
    })
  }
}