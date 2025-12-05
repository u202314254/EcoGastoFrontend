import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Usuariolistar } from './usuariolistar/usuariolistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-usuario',
    imports: [RouterOutlet, Usuariolistar, Menu],
    templateUrl: './usuario.html',
    styleUrl: './usuario.css',
})
export class Usuario {
    constructor(public route:ActivatedRoute) {}
}