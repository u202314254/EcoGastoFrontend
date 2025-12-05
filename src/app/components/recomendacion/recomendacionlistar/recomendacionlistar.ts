import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Recomendacion } from '../../../models/Recomendacion';
import { Recomendacionservice } from '../../../services/recomendacionservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({ 
    selector: 'app-recomendacionlistar',
    imports: [MatTableModule, RouterLink, MatIconModule, MatCardModule, MatPaginatorModule, CommonModule],
    templateUrl: './recomendacionlistar.html',
    styleUrl: './recomendacionlistar.css',
})
export class Recomendacionlistar implements OnInit {
    dataSource:MatTableDataSource<Recomendacion>=new MatTableDataSource<Recomendacion>()
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private reS:Recomendacionservice) {}

    ngOnInit(): void {
    this.reS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    });
    this.reS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    }); 
    }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    eliminar(id: number) {
    this.reS.delete(id).subscribe(data=>{
      this.reS.list().subscribe(data=>{
        this.reS.setList(data)
      })
    })
  }
} 