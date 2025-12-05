import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Seguridad } from '../../../models/Seguridad';
import { Seguridadservice } from '../../../services/seguridadservice';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-seguridadlistar',
    imports: [MatTableModule,RouterLink, MatIconModule, MatCardModule, MatPaginatorModule],
    templateUrl: './seguridadlistar.html',
    styleUrl: './seguridadlistar.css',
})
export class Seguridadlistar implements OnInit {
    dataSource:MatTableDataSource<Seguridad>=new MatTableDataSource<Seguridad>()
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private sS:Seguridadservice) {}

    ngOnInit(): void {
    this.sS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    });
    this.sS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
      eliminar(id: number) {
    this.sS.delete(id).subscribe(data=>{
      this.sS.list().subscribe(data=>{
        this.sS.setList(data)
      })
    })
  }
}