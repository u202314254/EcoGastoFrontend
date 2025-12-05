import { Hogar } from './Hogar';

export class Usuario{
    idUsuario:number=0
    hogar:Hogar=new Hogar()
    username:string=""
    correo:string=""
    password:string=""
    estado:boolean=false
}