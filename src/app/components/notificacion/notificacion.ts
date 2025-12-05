import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Notificacionlistar } from './notificacionlistar/notificacionlistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-notificacion',
    standalone: true,
    imports: [RouterOutlet, Notificacionlistar, Menu],
    templateUrl: './notificacion.html',
    styleUrl: './notificacion.css',
})
export class Notificacion {
    constructor(public route:ActivatedRoute) {}
}