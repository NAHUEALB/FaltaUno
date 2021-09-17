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
	enlaceNoticia = 'Noticia';
	indexNumerador = 1;
	mostrarNoticias = false;
	delayEntreNoticias = 12000;

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
		this.mostrarNoticias = true;
	}

	irAlHistorial(){
		this.router.navigate([`/historial`]);
	}

	irAlPerfil(){
		this.router.navigate([`/perfil`]);
	}

	ionViewWillEnter() {
		this.mostrarNoticias = true;
		this.storage.get("jugador").then(jugadorDelStorage => {
			this.jugador = jugadorDelStorage;
			this.nombre = " " + this.jugador.nombre;
		})
		.catch(() => {
			console.log("No se cargó el storage antes de querer mostrarlo")
		});

		this.nextNoticia();
	}

	ionViewWillLeave() {
		this.nombre = "";
		this.mostrarNoticias = false;
	}

	nextNoticia() {
		// nahu hacé todo el refactor que quieras jajsdjkas
		let oldSlider = document.getElementById("slide"+this.indexNumerador);
		let oldNumerador = document.getElementById("numerador"+this.indexNumerador);

		this.indexNumerador++;
		if (this.indexNumerador == 4) this.indexNumerador = 1;

		let newSlider = document.getElementById("slide"+this.indexNumerador);
		let newNumerador = document.getElementById("numerador"+this.indexNumerador);

		setTimeout(() => {
			oldSlider.style.opacity = "0";
			newSlider.style.opacity = "1";
			oldNumerador.style.color = "white";
			newNumerador.style.color = "orangered";
			if (this.mostrarNoticias) this.nextNoticia(); 
		}, this.delayEntreNoticias);
	}
}
