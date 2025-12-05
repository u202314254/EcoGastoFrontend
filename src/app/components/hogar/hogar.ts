import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Hogarlistar } from './hogarlistar/hogarlistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-hogar',
    imports: [RouterOutlet, Hogarlistar, Menu],
    templateUrl: './hogar.html',
    styleUrl: './hogar.css',
})
export class Hogar {
    constructor(public route:ActivatedRoute) {}
}