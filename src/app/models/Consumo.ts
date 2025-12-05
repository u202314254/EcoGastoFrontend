import { Recurso } from './Recurso';
import { Usuario } from './Usuario';

export class Consumo{
    idConsumo:number=0
    usuario: Usuario = new Usuario()
    recurso: Recurso = new Recurso()
    cantidad:number=0
    costo:number=0
    fecha:Date=new Date()
    descripcion:string=""
} 
