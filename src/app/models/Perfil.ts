import { Usuario } from "./Usuario";

export class Perfil{
    idPerfil:number=0;
    usuario: Usuario = new Usuario();
    nombre:string="";
    edad:Date=new Date()
    genero:string="";
    telefono:string="";
}