import { Events } from './../../serv/events.service';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Partido } from 'src/app/models/partido';
import { Jugador } from 'src/app/models/jugador';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
	enlace = 'Jugador';
	jugador = {
		id: '',
		id_firebase: '',
		nombre: '',
		usuario: '',
		password: '',
		email: '',
		fnacimiento: '',
		puntaje: 0,
		cantidad_votos: 0,
		sexo: "",
		perfil: false,
		ubicacion: ' La Plata ',
	};
	partido: Partido;
	edad: number;
	valoracion: number;
	stars = [];
	nameIcon: String;
	idColor: String;
	imgUrl: String;
	resultado = "3 - 4"
	ACTUALIZAR_STORAGE = "actualizar:storage";

  	constructor( 
	private router: Router, 
	private storage: Storage,
	){ 	
		this.storage.get('jugador')
		.then((jugador) => {
			this.jugador = jugador; 
			console.log("INFO DEL JUGADOR OBTENIDA DESDE PERFIL",this.jugador)
		})
		.catch(() => {
			console.log("Primer error de querer cargar info del jugador desde el Storage")
		});
	}

  	ngOnInit() {}

	ionViewWillEnter(){
		this.storage.get("jugador").then(jugadorDelStorage => {
			this.jugador = jugadorDelStorage;
			this.edad = this.getEdad(this.jugador.fnacimiento);
			this.valoracion = this.getValoracion(this.jugador.puntaje, this.jugador.cantidad_votos);
			this.resultado = "4 - 2"
			this.fillStars(this.valoracion);
			this.showSexo();
			this.showFotoCiudad();
		});
	}

	irAlEditar(){
		this.storage.set("jugador", this.jugador).then(()=>{
			console.log("INFO DEL JUGADOR GUARDADA DESDE PERFIL", this.jugador)
			this.router.navigate([`/editar`]);
		})
	}

	irAlHistorial(){
		this.storage.set("jugador", this.jugador).then(()=>{
			console.log("INFO DEL JUGADOR GUARDADA DESDE PERFIL", this.jugador)
			this.router.navigate([`/historial`]);
		})
	}

	irAlInicio(){
		this.storage.set("jugador", this.jugador).then(()=>{
			console.log("INFO DEL JUGADOR GUARDADA DESDE PERFIL", this.jugador)
			this.router.navigate([`/inicio`]);
		})
	}

	getEdad(dateNacimiento) {
		let newDate = new Date(dateNacimiento);
		let diff = Date.now() - newDate.getTime();
		let dateToYears = new Date(diff);
		return dateToYears.getFullYear() - 1970;
	}

	getValoracion(puntos, votos) {
		if (votos != 0) return Number((puntos/votos).toFixed(2));
		return 0;
	}
	
	fillStars(value) {
		this.stars = [];
		for (let i=0; i<5; i++) {
			if (value - .75 >= i) this.stars.push("full")
			else if (value - .25 >= i) this.stars.push("half")
			else this.stars.push("null");
		}
	}

	openTab(tab: String){
		let jugadorExtra : NavigationExtras = {
			state: {
				jugador: this.jugador
			}
		}
		this.router.navigate(['perfil/'+tab], jugadorExtra);
	}

	showSexo() {
		switch (this.jugador.sexo) {
			case " Hombre ": 
				this.nameIcon = "male-outline";
				this.idColor = "icon-hombre";
				break;
			case " Mujer ": 
				this.nameIcon = "female-outline";
				this.idColor = "icon-mujer";
				break;
			case " No binario ": 
				this.nameIcon = "male-female-outline";
				this.idColor = "icon-nobin";
				break;
		}
	}

	showFotoCiudad() {
		const headerParaImagen = document.getElementById("blk-crest-header")
		switch (this.jugador.ubicacion) {
			case " La Plata ":
				headerParaImagen.classList.add("bg-laplata");
				headerParaImagen.classList.remove("bg-berisso");
				headerParaImagen.classList.remove("bg-ensenada");
				this.imgUrl = '../../../assets/imgs/localidades/01-la_plata.jpg'; 
				break;
			case " Berisso ":
				headerParaImagen.classList.add("bg-berisso");
				headerParaImagen.classList.remove("bg-laplata");
				headerParaImagen.classList.remove("bg-ensenada");
				this.imgUrl = '../../../assets/imgs/localidades/02-berisso.jpg'; 
				break;
			case " Ensenada ": 
				headerParaImagen.classList.add("bg-ensenada");
				headerParaImagen.classList.remove("bg-laplata");
				headerParaImagen.classList.remove("bg-berisso");
				this.imgUrl = '../../../assets/imgs/localidades/03-ensenada.jpg'; 
				break;
		}
	}
}
