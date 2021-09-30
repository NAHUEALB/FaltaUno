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

	partidos = [
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "12:00",
			sexo: " Masculino ",
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "12:00",
			sexo: " Mixto "
		}
	]

	constructor(
	private menuCtrl: MenuController, 
	private router: Router, 
	// public firebaseauthService: FirebaseauthService,
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
		this.partidos.forEach(unPartido => {
			this.setSexo(unPartido)
			this.setColorSlot(unPartido)
		});
	}

	irAlHistorial(){
		this.router.navigate([`/historial`]);
	}

	irAlPerfil(){
		this.router.navigate([`/perfil`]);
	}
	
	irAlBuscar() {
		this.router.navigate([`/buscar`]);
	}

	irAlModalAyuda() {
		console.log("Debería abrir el modal de ayuda")
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

	setSexo(elem) {
		switch (elem.sexo) {
			case " Masculino ": 
				elem.iconName = "male-outline";
				elem.iconColor = "icon-hombre";
				break;
			case " Femenino ": 
				elem.iconName = "female-outline";
				elem.iconColor = "icon-mujer";
				break;
			case " Mixto ": 
				elem.iconName = "male-female-outline";
				elem.iconColor = "icon-nobin";
				break;
		}
	}
	
	setColorSlot(elem) {
		elem.optionFlama = "";
		if (elem.slotsOcupados < 5) {
			elem.slotColor = "slot-disponible";
		} else if (elem.slotsOcupados < 8) {
			elem.slotColor = "slot-popular";
		} else {
			elem.optionFlama = "flama";
			elem.slotColor = "slot-ocupado";
		}
	}
}
