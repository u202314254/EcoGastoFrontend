import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Insignia } from '../models/Insignia';
import { Subject } from 'rxjs';
const base_url=environment.base
@Injectable({
    providedIn: 'root',
})
export class Insigniaservice {
    private url=`${base_url}/insignias`;
    private listaCambio = new Subject<Insignia[]>();

    constructor(private http:HttpClient) {}

    list(){ 
    return this.http.get<Insignia[]>(this.url)
    }

    insert(i: Insignia) {
        return this.http.post(this.url, i);
      }
    
      setList(listaNueva: Insignia[]) {
        this.listaCambio.next(listaNueva);
      }
      getList() {
        return this.listaCambio.asObservable();
      }
    
      listId(id: number) {
        return this.http.get<Insignia>(`${this.url}/${id}`);
      }
    
      update(i: Insignia) {
        return this.http.put(this.url, i, { responseType: 'text' });
      }
    
      delete(id: number) {
        return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
      }
}