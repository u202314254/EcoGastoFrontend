import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Consumo } from '../models/Consumo';
import { Observable, Subject } from 'rxjs';
import { GastoxConsumoDTO } from '../models/gastoxconsumoDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Consumoservice {
  private url = `${base_url}/consumos`;
  private listaCambio = new Subject<Consumo[]>();

  constructor(private http: HttpClient) {}

  private buildHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  list(): Observable<Consumo[]> {
    return this.http.get<Consumo[]>(this.url, {
      headers: this.buildHeaders()
    });
  }

  insert(c: Consumo) {
    return this.http.post(this.url, c, {
      headers: this.buildHeaders()
    });
  }

  setList(listaNueva: Consumo[]) {
    this.listaCambio.next(listaNueva);
  }

  getList() {
    return this.listaCambio.asObservable();
  }

  listId(id: number) {
    return this.http.get<Consumo>(`${this.url}/${id}`, {
      headers: this.buildHeaders()
    });
  }

  update(c: Consumo) {
    return this.http.put(this.url, c, {
      headers: this.buildHeaders(),
      responseType: 'text'
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.buildHeaders(),
      responseType: 'text'
    });
  }

  getQuantity(): Observable<GastoxConsumoDTO[]> {
    return this.http.get<GastoxConsumoDTO[]>(`${this.url}/gasto`, {
      headers: this.buildHeaders()
    });
  }
}
