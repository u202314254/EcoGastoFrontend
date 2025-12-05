import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Hogar } from '../models/Hogar';
import { Observable, Subject } from 'rxjs';
const base_url = environment.base;
@Injectable({
  providedIn: 'root',
})
export class Hogarservice {
  private url = `${base_url}/hogares`;

  private listaCambio = new Subject<Hogar[]>();

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Hogar[]>(this.url);
  }

  insert(hogar: Hogar): Observable<Hogar> {
    return this.http.post<Hogar>(this.url, hogar);
  }
  setList(listaNueva: Hogar[]) {
    this.listaCambio.next(listaNueva);
  }
  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Hogar>(`${this.url}/${id}`);
  }

  update(h: Hogar) {
    return this.http.put(this.url, h, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getHogares(): Observable<Hogar[]> {
    return this.http.get<Hogar[]>(this.url);
  }
}
