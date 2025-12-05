import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta } from '../models/Meta';
import { Observable, Subject } from 'rxjs';
import { CantidadMetaActivaDTO } from '../models/CantidadMetaActivaDTO';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class Metaservice {
  private url = `${base_url}/metas`;
  private listaCambio = new Subject<Meta[]>();

  constructor(private http: HttpClient) {}

  private buildHeaders() {
    const token = sessionStorage.getItem('token'); 

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  list() {
    return this.http.get<Meta[]>(this.url, {
      headers: this.buildHeaders(),
    });
  }

  insert(m: Meta) {
    return this.http.post(this.url, m, {
      headers: this.buildHeaders(),
    });
  }

  listId(id: number) {
    return this.http.get<Meta>(`${this.url}/${id}`, {
      headers: this.buildHeaders(),
    });
  }

  update(m: Meta) {
    return this.http.put(`${this.url}`, m, {
      headers: this.buildHeaders(),
      responseType: 'text',
    });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.buildHeaders(),
      responseType: 'text',
    });
  }

  setList(listaNueva: Meta[]) {
    this.listaCambio.next(listaNueva);
  }
  
  getList() {
    return this.listaCambio.asObservable();
  }
}
