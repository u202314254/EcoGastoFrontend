import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/Usuario';
import { Subject } from 'rxjs';
const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class Usuarioservice {
  private url = `${base_url}/usuarios`;
  private listaCambio = new Subject<Usuario[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Usuario[]>(this.url);
  }

  insert(u: Usuario) {
    return this.http.post(this.url, u);
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  update(u: Usuario) {
    return this.http.put(`${this.url}`, u, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  
}
