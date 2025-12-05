import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Consumo } from '../../../models/Consumo';
import { Consumoservice } from '../../../services/consumoservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import {  MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-consumolistar',
  imports: [MatTableModule, RouterLink, MatIconModule, MatButtonModule, DatePipe, MatCardModule, MatPaginatorModule],
  templateUrl: './consumolistar.html',
  styleUrl: './consumolistar.css',
})
export class Consumolistar implements OnInit {
  dataSource: MatTableDataSource<Consumo> = new MatTableDataSource<Consumo>();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private cS: Consumoservice) {}

  ngOnInit(): void {
    this.cS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.cS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  Celiminar(id:number){

    this.cS.delete(id).subscribe(data=>{this.cS.list().subscribe(data=>{this.cS.setList(data)})})
  }
}
