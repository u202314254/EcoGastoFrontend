import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Recurso } from '../../../models/Recurso';
import { Recursoservice } from '../../../services/recursoservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-recursolistar',
    imports: [MatTableModule, RouterLink, MatIconModule, MatPaginatorModule, MatCardModule],
    templateUrl: './recursolistar.html',
    styleUrl: './recursolistar.css',
})
export class Recursolistar implements OnInit {
    dataSource:MatTableDataSource<Recurso>=new MatTableDataSource<Recurso>()
    displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private rS:Recursoservice) {}

    ngOnInit(): void {
    this.rS.list().subscribe(data=>{
    this.dataSource=new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    });
    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
    eliminar(id: number) {
    this.rS.delete(id).subscribe(data=>{
      this.rS.list().subscribe(data=>{
        this.rS.setList(data)
      })
    })
  }
}