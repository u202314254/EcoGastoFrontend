import { Usuario } from "./Usuario";

export class Seguridad{
    idSeguridad:number=0
    usuario:Usuario=new Usuario()
    ultimoLogin:Date=new Date()
    ipDispositivos:string=""
    intentosFallidos:number=0
}