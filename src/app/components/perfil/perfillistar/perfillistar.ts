import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Perfil } from '../../../models/Perfil';
import { Perfilservice } from '../../../services/perfilservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-perfillistar',
  imports: [MatTableModule,RouterLink, MatIconModule, MatCardModule, MatPaginatorModule, DatePipe],
  templateUrl: './perfillistar.html',
  styleUrl: './perfillistar.css',
})
export class Perfillistar implements OnInit {
  dataSource: MatTableDataSource<Perfil> = new MatTableDataSource<Perfil>();
  displayedColumns: string[] = [
    'c1',
    'c2',
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
    'c8'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private pS: Perfilservice) {}

  ngOnInit(): void {
    this.pS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    this.pS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  eliminar(id: number) {
    this.pS.delete(id).subscribe(data => {
      this.pS.list().subscribe((data) => {
        this.pS.setList(data);
      });
    });
  }
}
