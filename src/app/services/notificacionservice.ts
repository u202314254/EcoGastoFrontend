import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Notificacion } from '../models/Notificacion';
import { Observable, Subject } from 'rxjs';
import { NotificacionesxUsuarioDTO } from '../models/NotificacionesxUsuarioDTO';
import { NotificacionNoLeidaDTO } from '../models/NotificacionNoLeidaDTO';
const base_url = environment.base
@Injectable({
  providedIn: 'root',
})
export class Notificacionservice {
  private url = `${base_url}/notificaciones`
  private listaCambio = new Subject<Notificacion[]>();


  constructor(private http: HttpClient) { }
  private buildHeaders() {
    const token = sessionStorage.getItem('token'); // ←🔥 AQUÍ EL FIX

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  list() {
    return this.http.get<Notificacion[]>(this.url)
  }

  insert(n: Notificacion) {
    return this.http.post(this.url, n);
  }

  setList(listaNueva: Notificacion[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Notificacion>(`${this.url}/${id}`);
  }

  update(n: Notificacion) {
    return this.http.put(this.url, n, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  getUsuarios(): Observable<NotificacionesxUsuarioDTO[]> {
    return this.http.get<NotificacionesxUsuarioDTO[]>(`${this.url}/reporte-usuarios`);
  }
  getNotificacionesNoLeidas(): Observable<NotificacionNoLeidaDTO[]> {
    return this.http.get<NotificacionNoLeidaDTO[]>(`${this.url}/notificacionleida`, {
      headers: this.buildHeaders(),
    });
  }
}