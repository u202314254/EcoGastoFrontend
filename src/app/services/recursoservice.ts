import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Recurso } from '../models/Recurso';
import { Observable, Subject } from 'rxjs';
const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class Recursoservice {
  private url = `${base_url}/recursos`;
  private listaCambio = new Subject<Recurso[]>();

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Recurso[]>(this.url);
  }

  insert(r: Recurso) {
    return this.http.post(this.url, r);
  }

  setList(listaNueva: Recurso[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Recurso>(`${this.url}/${id}`);
  }

  update(r: Recurso) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  getRecursos(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(this.url);
  }
}
