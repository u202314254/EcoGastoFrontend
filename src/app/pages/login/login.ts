import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtRequestDTO } from '../../models/jwtRequestDTO';
import { LoginService } from '../../services/login-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuarioservice } from '../../services/usuarioservice';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatSnackBarModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private usuarioService: Usuarioservice,
    private snackBar: MatSnackBar
  ) {}

  username: string = '';
  password: string = '';
  mensaje: string = '';

  ngOnInit(): void {}

  iniciarSesion() {
    let request = new JwtRequestDTO();
    request.username = this.username;
    request.password = this.password;
    this.loginService.login(request).subscribe(
      (data: any) => {
        sessionStorage.setItem('token', data.jwttoken);
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(data.jwttoken);
        const usernameLogeado = decodedToken.sub;

        this.usuarioService.list().subscribe((usuarios: any[]) => {
        const usuarioEncontrado = usuarios.find(u => u.username === usernameLogeado);

        if (usuarioEncontrado) {
          sessionStorage.setItem('usuarioSesion', JSON.stringify(usuarioEncontrado));

        this.router.navigate(['miconsumo']);
        } else {
          console.error('Login correcto, pero no encontré los datos del usuario ' + usernameLogeado);
        }
        });
      },
      (error) => {
        this.mensaje = 'Credenciales incorrectas!!!';
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      }
    );
  }
}

