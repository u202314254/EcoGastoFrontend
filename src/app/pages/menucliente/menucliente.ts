import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-menucliente',
  imports: [CommonModule, RouterLink, RouterOutlet, MatIconModule],
  templateUrl: './menucliente.html',
  styleUrl: './menucliente.css',
})
export class Menucliente implements OnInit {
  isCollapsed = false;
  role: string = '';
  usuario: string = '';

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.role = this.loginService.showRole();
    const dataRaw = sessionStorage.getItem('usuarioSesion');
    if (dataRaw) {
      const userObj = JSON.parse(dataRaw);
      this.usuario = userObj.username || userObj.nombre || 'Anonimo';
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  verificar() {
    this.role = this.loginService.showRole();

    return this.loginService.verificar();
  }
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isClient() {
    return this.role === 'CLIENT';
  }
}
  