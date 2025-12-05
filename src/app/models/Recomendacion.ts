import { Meta } from './Meta';
export class Recomendacion{
    idRecomendacion:number=0
    meta:Meta=new Meta()
    descripcion:string=""
    categoria:string=""
    fechapublicacion:Date=new Date()
    fuente:string=""
}   