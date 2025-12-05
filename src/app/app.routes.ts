import { Routes } from '@angular/router';
import { Insigniainsertar } from './components/insignia/insigniainsertar/insigniainsertar';
import { Insignia } from './components/insignia/insignia';
import { Hogar } from './components/hogar/hogar';
import { Hogarinsetar } from './components/hogar/hogarinsertar/hogarinsertar';
import { Recomendacion } from './components/recomendacion/recomendacion';
import { Recomendacioninsertar } from './components/recomendacion/recomendacioninsertar/recomendacioninsertar';
import { Meta } from './components/metaa/meta';
import { Consumo } from './components/consumo/consumo';
import { Consumoinsertar } from './components/consumo/consumoinsertar/consumoinsertar';
import { Metainsertar } from './components/metaa/metainsertar/metainsertar';
import { Notificacion } from './components/notificacion/notificacion';
import { Notificacioninsertar } from './components/notificacion/notificacioninsertar/notificacioninsertar';
import { Perfil } from './components/perfil/perfil';
import { Perfilinsertar } from './components/perfil/perfilinsertar/perfilinsertar';
import { Usuario } from './components/usuario/usuario';
import { Recursoinsertar } from './components/recurso/recursoinsertar/recursoinsertar';
import { Recurso } from './components/recurso/recurso';
import { Usuarioinsertar } from './components/usuario/usuarioinsertar/usuarioinsertar';
import { Rol } from './components/rol/rol';
import { Rolinsertar } from './components/rol/rolinsertar/rolinsertar';
import { Seguridad } from './components/seguridad/seguridad';
import { Seguridadinsertar } from './components/seguridad/seguridadinsertar/seguridadinsertar';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Funcionalidades } from './pages/funcionalidades/funcionalidades';
import { Beneficios } from './pages/beneficios/beneficios';
import { Registrar } from './pages/registrar/Registrar';
import { Menucliente } from './pages/menucliente/menucliente';
import { MiConsumo } from './pages/miconsumo/miconsumo';
import { Mismetas } from './pages/mismetas/mismetas';
import { Dashboard } from './pages/dashboard/dashboard';
import { Misrecomendaciones } from './pages/misrecomendaciones/misrecomendaciones';
import { Misnotificaciones } from './pages/misnotificaciones/misnotificaciones';
import { seguridadGuard } from './guard/seguridad-guard';
import { Configuracion } from './pages/configuracion/configuracion';
import { Misinsignias } from './pages/misinsignias/misinsignias';
import { Metasincompletas } from './components/metasincompletas/metasincompletas';
import { Notificacionnoleida } from './components/notificacionnoleida/notificacionnoleida';
import { RecomendacionPorCategoria } from './components/recomendacion-por-categoria/recomendacion-por-categoria';
import { AccesosSospechosos } from './components/accesos-sospechosos/accesos-sospechosos';
import { Notificacionporusuario } from './components/notificacionporusuario/notificacionporusuario';
import { Nosotros } from './pages/nosotros/nosotros';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'funcionalidades', component: Funcionalidades },
  { path: 'beneficios', component: Beneficios },
  { path: 'nosotros', component: Nosotros },

  { path: 'login', component: Login },
  { path: 'registrar', component: Registrar },

  {
    path: '',
    component: Menucliente,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'miconsumo', component: MiConsumo },
      { path: 'mismetas', component: Mismetas },
      { path: 'metasincompletas', component: Metasincompletas },
      { path: 'notificacionnoleida', component: Notificacionnoleida },
      { path: 'misrecomendaciones', component: Misrecomendaciones },
      { path: 'recomendacionporcategoria', component: RecomendacionPorCategoria},
      { path: 'misnotificaciones', component: Misnotificaciones },
      { path: 'configuracion', component: Configuracion },
      { path: 'misinsignias', component:Misinsignias },
      { path: 'accesossospechosos', component: AccesosSospechosos},
      { path: 'notificacionporusuario', component: Notificacionporusuario}
    ],
  },

  // CRUD Consumo – rutas correctas
  {
    path: 'consumos',
    component: Consumo,
    children: [
      { path: 'Cnuevo', component: Consumoinsertar },
      { path: 'Cedits/:id', component: Consumoinsertar },
    ],
    canActivate: [seguridadGuard],
  },

  // --- lo demás igual ---
  {
    path: 'insignias',
    component: Insignia,
    children: [
      { path: 'Inuevo', component: Insigniainsertar },
      { path: 'Iedits/:id', component: Insigniainsertar },
    ],
    canActivate: [seguridadGuard],
  },

  {
    path: 'hogares',
    component: Hogar,
    children: [
      { path: 'Hnuevo', component: Hogarinsetar },
      { path: 'Hedits/:id', component: Hogarinsetar },
    ],
    canActivate: [seguridadGuard]
  },

  {
    path: 'recomendaciones',
    component: Recomendacion,
    children: [
      { path: 'Rnuevo', component: Recomendacioninsertar },
      { path: 'Redits/:id', component: Recomendacioninsertar },
    ],
    canActivate: [seguridadGuard],
  },

  {
    path: 'metas',
    component: Meta,
    children: [
      { path: 'Mnuevo', component: Metainsertar },
      { path: 'Medits/:id', component: Metainsertar },
    ],
    canActivate: [seguridadGuard],
  },

  {
    path: 'notificaciones',
    component: Notificacion,
    children: [
      { path: 'Nnuevo', component: Notificacioninsertar },
      { path: 'Nedits/:id', component: Notificacioninsertar },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'recursos',
    component: Recurso,
    children: [
      { path: 'Renuevo', component: Recursoinsertar },
      { path: 'Redits/:id', component: Recursoinsertar },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'usuarios',
    component: Usuario,
    children: [
      { path: 'Unuevo', component: Usuarioinsertar },
      { path: 'Uedits/:id', component: Usuarioinsertar },
    ],
    canActivate: [seguridadGuard],
  },

  {
    path: 'roles',
    component: Rol,
    children: [
      { path: 'Ronuevo', component: Rolinsertar },
      { path: 'Roedits/:id', component: Rolinsertar },
    ],
    canActivate: [seguridadGuard],
  },

  {
    path: 'seguridades',
    component: Seguridad,
    children: [
      { path: 'Snuevo', component: Seguridadinsertar },
      { path: 'Sedits/:id', component: Seguridadinsertar },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'perfiles',
    component: Perfil,
    children: [
      { path: 'Pnuevo', component: Perfilinsertar },
      { path: 'Pedits/:id', component: Perfilinsertar },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'configuracion',
    component: Perfil,
    children: [
      { path: 'Pnuevo', component: Perfilinsertar },
      { path: 'Pedits/:id', component: Perfilinsertar },
    ],
  },
];
