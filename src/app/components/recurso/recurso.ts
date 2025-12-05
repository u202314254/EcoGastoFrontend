import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Recursolistar } from './recursolistar/recursolistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-recurso',
    imports: [RouterOutlet, Recursolistar, Menu],
    templateUrl: './recurso.html',
    styleUrl: './recurso.css',
})
export class Recurso {
    constructor(public route:ActivatedRoute) {}
}