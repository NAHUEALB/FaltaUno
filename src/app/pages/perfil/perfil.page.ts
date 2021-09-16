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
	jugador: Jugador;
	partido: Partido;
	edad: number;
	valoracion: number;
	stars = [];
	getDocumentSubscription;

  	constructor( 
	private router: Router, 
	public firebaseauthService: FirebaseauthService,
	private storage: Storage
	){ 		
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

		this.partido = {
			resultado : "15 - 2",
			fecha: "10-2-2020",
			valoracion:12
		}
		
		this.storage.get("jugador").then(jugadorDelStorage => {
			this.jugador = jugadorDelStorage;
			this.edad = this.getEdad(this.jugador.fnacimiento);
			this.valoracion = this.getValoracion(this.jugador.puntaje, this.jugador.cvotos);
			this.fillStars(this.valoracion);
			this.showSexo();
		});
	}


  	ngOnInit() {
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
		console.log(this.jugador.sexo);
		switch (this.jugador.sexo) {
			case " Hombre ": 
				document.getElementById("icon-hombre").style.display = "block";
				break;
			case " Mujer ": 
				document.getElementById("icon-mujer").style.display = "block";
				break;
			case " No binario ": 
				document.getElementById("icon-nobin").style.display = "block";
				break;
		}
	}

	ionViewWillLeave(){
		if(this.getDocumentSubscription){
			this.getDocumentSubscription.unsubscribe();
		}
	}


	irAlEditar(){
		this.router.navigate(['/editar']);
	}

	irAlHistorial(){
		this.router.navigate([`/historial`]);
	}
}
