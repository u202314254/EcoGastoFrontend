import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Perfillistar } from './perfillistar/perfillistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-perfil',
    imports: [RouterOutlet, Perfillistar, Menu],
    templateUrl: './perfil.html',
    styleUrl: './perfil.css',
})
export class Perfil {
    constructor(public route:ActivatedRoute) {}
}