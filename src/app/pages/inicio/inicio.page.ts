import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombre;

  constructor(private menuCtrl: MenuController,private router: Router) {
    this.menuCtrl.enable(true);
   }

  ngOnInit() {
    // let nomUsuario="@roberto";
    // let edad= 15 ;
    // let nombre="Nahuel";
    // this.usuario = new Usuario(nombre,nomUsuario,edad);
  }

}
