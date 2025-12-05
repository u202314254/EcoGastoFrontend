import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Metalistar } from './metalistar/metalistar';
import { Menu } from '../../pages/menu/menu';

@Component({
    selector: 'app-meta',
    standalone: true,
    imports: [RouterOutlet, Metalistar, Menu],
    templateUrl: './meta.html',
    styleUrl: './meta.css',
})
export class Meta {
    constructor(public route:ActivatedRoute) {}
}