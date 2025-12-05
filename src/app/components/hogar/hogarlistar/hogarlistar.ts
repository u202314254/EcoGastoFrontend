import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Hogar } from '../../../models/Hogar';
import { Hogarservice } from '../../../services/hogarservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
    selector: 'app-hogarlistar',
    imports: [MatTableModule, RouterLink, MatIconModule, MatButtonModule, MatCardModule, MatPaginatorModule],
    templateUrl: './hogarlistar.html',
    styleUrl: './hogarlistar.css',
})
export class Hogarlistar implements OnInit {
    dataSource:MatTableDataSource<Hogar>=new MatTableDataSource<Hogar>()
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private hS:Hogarservice) {}

    ngOnInit(): void {
    this.hS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    });
    this.hS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    eliminar(id: number) {
    this.hS.delete(id).subscribe(data=>{
      this.hS.list().subscribe(data=>{
        this.hS.setList(data)
      })
    }) 
  }
}