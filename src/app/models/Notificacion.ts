import { Usuario } from "./Usuario";

export class Notificacion{
    idNotificacion:number=0
    usuario:Usuario=new Usuario()
    titulo:string=""
    descripcion:string=""
    fecha:Date=new Date()
    leido:boolean=false
}