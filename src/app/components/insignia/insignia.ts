import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Insignialistar } from './insignialistar/insignialistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-insignia',
    imports: [RouterOutlet, Insignialistar, Menu],
    templateUrl: './insignia.html',
    styleUrl: './insignia.css',
})
export class Insignia {
    constructor(public route:ActivatedRoute) {}
}