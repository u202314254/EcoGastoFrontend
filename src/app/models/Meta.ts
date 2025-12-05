import { Recurso } from './Recurso';
import { Usuario } from './Usuario';

export class Meta{
    idMeta:number=0
    usuario:Usuario=new Usuario()
    recurso:Recurso=new Recurso()
    nombre:string=""
    estado:boolean=false
    fechainicio:Date=new Date()
    fechafin:Date=new Date()
    progreso:number=0
}