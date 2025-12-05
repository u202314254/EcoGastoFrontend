import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Rol } from '../../../models/Rol';
import { Rolservice } from '../../../services/rolservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-rollistar',
    imports: [MatTableModule,RouterLink, MatIconModule, MatCardModule, MatPaginatorModule],
    templateUrl: './rollistar.html',
    styleUrl: './rollistar.css',
})
export class Rollistar implements OnInit {
    dataSource:MatTableDataSource<Rol>=new MatTableDataSource<Rol>()
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private roS:Rolservice) {}

    ngOnInit(): void {
    this.roS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    });
    this.roS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    eliminar(id: number) {
    this.roS.delete(id).subscribe(data=>{
      this.roS.list().subscribe(data=>{
        this.roS.setList(data)
      })
    })
  }
}