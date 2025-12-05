import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Seguridad } from '../models/Seguridad';
import { Observable, Subject } from 'rxjs';
import { AccesosSeguridadDTO } from '../models/AccesosSeguridadDTO';
const base_url = environment.base
@Injectable({
  providedIn: 'root',
})
export class Seguridadservice {
  private url = `${base_url}/seguridades`;
  private listaCambio = new Subject<Seguridad[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Seguridad[]>(this.url)
  }

  insert(s: Seguridad) {
    return this.http.post(this.url, s);
  }

  setList(listaNueva: Seguridad[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Seguridad>(`${this.url}/${id}`);
  }

  update(s: Seguridad) {
    return this.http.put(this.url, s, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  accesosSospechosos(): Observable<AccesosSeguridadDTO[]> {
    return this.http.get<AccesosSeguridadDTO[]>(`${ this.url }/accesos`)
  }
}