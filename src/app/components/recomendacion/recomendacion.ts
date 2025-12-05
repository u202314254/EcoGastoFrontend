import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Recomendacionlistar } from './recomendacionlistar/recomendacionlistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-recomendacion',
    imports: [RouterOutlet, Recomendacionlistar, Menu],
    templateUrl: './recomendacion.html',
    styleUrl: './recomendacion.css',
})
export class Recomendacion {
    constructor(public route:ActivatedRoute) {}
}