import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Seguridadlistar } from './seguridadlistar/seguridadlistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-seguridad',
    imports: [RouterOutlet, Seguridadlistar, Menu],
    templateUrl: './seguridad.html',
    styleUrl: './seguridad.css',
})
export class Seguridad {
    constructor(public route:ActivatedRoute) {}
}