import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router: Router) {
    console.log("Constructor del inicio");
    console.log(this.router.getCurrentNavigation().extras);
    console.log(this.router.getCurrentNavigation().extras.state.usuario);
   }

  ngOnInit() {
    // let nomUsuario="@roberto";
    // let edad= 15 ;
    // let nombre="Nahuel";
    // this.usuario = new Usuario(nombre,nomUsuario,edad);
  }

}
