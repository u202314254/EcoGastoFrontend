import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Rollistar } from './rollistar/rollistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-rol',
    imports: [RouterOutlet, Rollistar, Menu],
    templateUrl: './rol.html',
    styleUrl: './rol.css',
})
export class Rol {
    constructor(public route:ActivatedRoute) {}
}