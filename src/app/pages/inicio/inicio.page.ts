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
    console.log("Constructor del inicio");
    console.log(this.router.getCurrentNavigation().extras);
    console.log(this.router.getCurrentNavigation().extras.state.jugador);


    this.menuCtrl.enable(true);

	try {
		this.nombre = this.router.getCurrentNavigation().extras.state.jugador.nombre;
	} catch {
		console.log("se intentó cargar el nombre siendo usuario indefined")
	}

   }

  ngOnInit() {
    // let nomUsuario="@roberto";
    // let edad= 15 ;
    // let nombre="Nahuel";
    // this.usuario = new Usuario(nombre,nomUsuario,edad);
  }

}
