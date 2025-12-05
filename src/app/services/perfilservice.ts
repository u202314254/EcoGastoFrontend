import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Perfil } from '../models/Perfil';
import { Subject } from 'rxjs';
const base_url=environment.base
@Injectable({
    providedIn: 'root',
})
export class Perfilservice {
    private url=`${base_url}/perfiles`;
    private listaCambio = new Subject<Perfil[]>();

    constructor(private http:HttpClient) {}

    list(){
    return this.http.get<Perfil[]>(this.url)
    }

    insert(p: Perfil) {
        return this.http.post(this.url, p);
      }
    
      setList(listaNueva: Perfil[]) {
        this.listaCambio.next(listaNueva);
      }
      getList() {
        return this.listaCambio.asObservable();
      }
    
      listId(id: number) {
        return this.http.get<Perfil>(`${this.url}/${id}`);
      }
    
      update(p: Perfil) {
        return this.http.put(`${this.url}`, p, { responseType: 'text' });
      }
    
      delete(id: number) {
        return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
      }
}