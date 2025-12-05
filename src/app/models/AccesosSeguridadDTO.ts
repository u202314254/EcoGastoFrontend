import { Usuario } from "./Usuario"

export class AccesosSeguridadDTO{
    id_usuario:Usuario=new Usuario()
    correo:string=''
    ultimo_login:string=''
    ip:string=''
    intentos_fallidos:number=0
} 
