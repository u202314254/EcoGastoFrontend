import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Recomendacion } from '../models/Recomendacion';
import { Observable, Subject } from 'rxjs';
import { RecomendacionDTOList } from '../models/RecomendacionDTOList';
const base_url=environment.base
@Injectable({
    providedIn: 'root',
})
export class Recomendacionservice {
    private url=`${base_url}/recomendaciones`;
    private listaCambio = new Subject<Recomendacion[]>();

    constructor(private http:HttpClient) {}

    list(){
    return this.http.get<Recomendacion[]>(this.url)
    }

    insert(r: Recomendacion) {
        return this.http.post(this.url, r);
      }
    
      setList(listaNueva: Recomendacion[]) {
        this.listaCambio.next(listaNueva);
      }
      getList() {
        return this.listaCambio.asObservable();
      }
    
      listId(id: number) {
        return this.http.get<Recomendacion>(`${this.url}/${id}`);
      }
    
      update(r: Recomendacion) {
        return this.http.put(this.url, r, { responseType: 'text' });
      }
    
      delete(id: number) {
        return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
      }
      getCategoria(categoria: string): Observable<RecomendacionDTOList[]> {
    return this.http.get<RecomendacionDTOList[]>(`${this.url}/buscar?categoria=${categoria}`);
  }
} 