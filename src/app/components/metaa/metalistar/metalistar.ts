import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Meta } from '../../../models/Meta';
import { Metaservice } from '../../../services/metaservice';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-metalistar',
    imports: [MatTableModule,RouterLink, MatIconModule, DatePipe, MatCardModule, MatPaginatorModule],
    templateUrl: './metalistar.html',
    styleUrl: './metalistar.css',
})
export class Metalistar implements OnInit {
    dataSource: MatTableDataSource<Meta> = new MatTableDataSource<Meta>();
    displayedColumns: string[] = ['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private mS: Metaservice) {}

    ngOnInit(): void {
        this.mS.list().subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
        });
        this.mS.getList().subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
        });
    }

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    }
    eliminar(id: number) {
        this.mS.delete(id).subscribe(() => {
            this.mS.list().subscribe(data => {
                this.mS.setList(data);
            });
        });
    }
}
