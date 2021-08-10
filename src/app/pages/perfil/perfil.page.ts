import { Component, OnInit } from '@angular/core';
import { Partido } from 'src/app/models/partido';
import { Usuario } from 'src/app/models/usuario';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: Usuario;
  partido: Partido;

  constructor() { 
    let nombre = "pepote";
      
    this.usuario = {
      nomUsuario: "pepito",
      edad: 15,
      nombre: nombre
     }

    this.partido = {
      resultado : "15 - 2"
    }
   }

  ngOnInit() {

  }

}
