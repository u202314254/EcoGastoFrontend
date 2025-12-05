import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Insignia } from '../../../models/Insignia';
import { Insigniaservice } from '../../../services/insigniaservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-insignialistar',
  imports: [MatTableModule, RouterLink, MatIconModule, MatCardModule, MatPaginatorModule],
  templateUrl: './insignialistar.html',
  styleUrl: './insignialistar.css',
})
export class Insignialistar implements OnInit {
  dataSource: MatTableDataSource<Insignia> = new MatTableDataSource<Insignia>();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private iS: Insigniaservice) {}

  ngOnInit(): void {
    this.iS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.iS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  eliminar(id: number) {
    this.iS.delete(id).subscribe(() => {
      this.iS.list().subscribe((data) => {
        this.iS.setList(data);
      });
    });
  }
}
