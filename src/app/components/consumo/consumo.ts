import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Consumolistar } from './consumolistar/consumolistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-consumo',
    imports: [RouterOutlet, Consumolistar, Menu],
    templateUrl: './consumo.html',
    styleUrl: './consumo.css',
})
export class Consumo {
    constructor(public route:ActivatedRoute) {}
}