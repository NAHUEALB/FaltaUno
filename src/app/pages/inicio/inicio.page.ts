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
	noticias = [
		"Buscá partidos cerca de tu zona, encontrá amigos, y participá de la comunidad de fútbol platense más grande del condado", 
		"Si te falta un jugador, siempre podés acudir a nuestra app para encontrar a ese que falta, por más que se haga rogar", 
		"Recordá invitar a tus amigos para que la comunidad crezca cada vez más y nadie se quede con las ganas de jugar", 
		"Planeamos estar operativos a fin de año, así que andá lustrando esos botines que juegan de titulares dentro de poco"];
	noticia = "Cargando noticias...";
	indexNoticia = 0;
	blockNoticia = document.getElementById("text-noticia");

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
		this.nextNoticia();
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

	nextNoticia() {
		let blockNoticia = document.getElementById("text-noticia");
		this.indexNoticia++;
		if (this.indexNoticia == 4) {
			this.indexNoticia = 0;
		}
		this.noticia = this.noticias[this.indexNoticia];
		setTimeout(() => {
			blockNoticia.classList.add('hide');
		}, 9000);
		setTimeout(() => { 
			blockNoticia.classList.remove('hide');
			this.nextNoticia(); 
		}, 10000 );
	}
}
