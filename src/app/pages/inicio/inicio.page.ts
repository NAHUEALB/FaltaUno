import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jugador } from 'src/app/models/jugador';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
	enlace: 'Jugador';
	jugador: Jugador;
	nombre: string = ''; 

	constructor(
	private menuCtrl: MenuController, 
	private router: Router, 
	public firebaseauthService: FirebaseauthService,
	private storage: Storage
	){
		this.menuCtrl.enable(true);
		
		this.jugador = {
			id:"0",
			nombre: '',
			usuario: '',
			fnacimiento: '',
			puntaje: 0,
			cvotos: 0,
			sexo: '',
			perfil: false,
			foto: '',
			ubicacion: '',
			html: '',
		}
		
	}

	ngOnInit() {
		
	}

	irAlBuscar(){
		this.router.navigate([`/buscar`]);
	}

	irAlPerfil(){
		this.router.navigate([`/tabs`]);
	}

	ionViewWillEnter() {
		this.storage.get("jugador").then(jugadorDelStorage => {
			this.jugador = jugadorDelStorage;
			this.nombre = " " + jugadorDelStorage.nombre;
		})
		.catch(() => {
			console.log("No se cargó el storage antes de querer mostrarlo")
		});
	}

	ionViewWillLeave() {
		this.nombre = "";
	}
}
