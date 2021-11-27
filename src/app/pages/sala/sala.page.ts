import { ModalController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Jugador } from 'src/app/models/jugador';
import { Cancha } from 'src/app/models/cancha';
import { Sala } from 'src/app/models/sala';
import { AyudaMenuLateralPage } from '../ayuda-menu-lateral/ayuda-menu-lateral.page';
import { MercadopagoService } from 'src/app/serv/mercadopago.service';
import { Item, Request, Response } from 'src/app/models/request.model';
import { AyudaPage } from '../ayuda/ayuda.page';
import { PartidoPage } from '../partido/partido.page';

@Component({
	selector: 'app-sala',
	templateUrl: './sala.page.html',
	styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

	enlace = 'Jugador';
	enlaceCanchasLP = 'CanchasLP';
	docSubscription;
	canchaSubscription;
	usuarioSubscription;
	jugadoresSubscription;
	jugSubscription;
	cargando = false;

	salaNombre = 'Sala'
	salaDireccion = 'Esperando geolocalización'
	salaPrecio = 1800
	salaEstado = '...'
	salaSexo = '...'

	idsFirebaseBots = [];
	arrJugadores: Jugador[] = [];
	
	jugadorVacio = {
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
	}
	equipoRed = [];
	equipoBlue = [];
	stars: any[];
	enlaceMP = new Response();

	partido
	jugadores = []
	idsJugadores

	constructor(
		public menuCtrl: MenuController,
		private modalController: ModalController,
		private router: Router,
		private route: ActivatedRoute,
		public firebaseauthService: FirebaseauthService,
		private storage: Storage,
		private socialSharing: SocialSharing,
		private mercadoPagoService: MercadopagoService
	) {
		this.partido = this.router.getCurrentNavigation().extras.state.partido
		this.idsJugadores = this.router.getCurrentNavigation().extras.state.idsJugadores
		this.salaNombre = this.partido.cancha.nombreCancha
		this.salaDireccion = this.partido.cancha.direccion
		this.salaPrecio = this.partido.cancha.precio
		this.salaEstado = this.partido.estado
		this.salaSexo = this.partido.sexo
		this.jugadores = []
		for (let i=0; i<10; i++) {
			if (this.idsJugadores[i] !== 0) {
				let requestSql = 'https://backend-f1-java.herokuapp.com/jugadores/' + this.idsJugadores[i] 
				fetch(requestSql)
				.then(res => res.json())
				.then(data => {
					let jugador = data;
					let scoreStars = jugador.puntaje / jugador.cantVotos
					this.fillStars(jugador, scoreStars)
					this.jugadores.push(jugador)
					this.repartirEquiposRedYBlue(this.jugadores)
				})
			}
		}
	}

	ngOnInit() {}

	ionViewWillEnter() {
		console.log("entrando a sala")
	}

	repartirEquiposRedYBlue(jugs) {
		this.equipoRed = []
		this.equipoBlue = []
		jugs.forEach((j, i) => i%2!=0 ? this.equipoRed.push(j) : this.equipoBlue.push(j))
		for (let i=0; i<5; i++) 
			if (!this.equipoRed[i]) this.equipoRed.push({nombre: " (vacío) "})
		for (let i=0; i<5; i++) 
			if (!this.equipoBlue[i]) this.equipoBlue.push({nombre: " (vacío) "})
	}

	async abrirModalPago() {
		const modal = await this.modalController.create({
			component: AyudaPage,
			cssClass: 'modal-css',
			componentProps: {
				'enlaceMP': this.enlaceMP.sandbox_init_point
			  },
			swipeToClose: true,
			presentingElement: await this.modalController.getTop()
		});
		await modal.present();
	}

	getValoracion(puntos, votos) {
		if (votos != 0) return Number((puntos/votos).toFixed(2));
		return 0;
	}

	fillStars(player, value) {
		player.stars = [];
		for (let i=0; i<5; i++) {
			if (value - .75 >= i) player.stars.push("full")
			else if (value - .25 >= i) player.stars.push("half")
			else player.stars.push("null");
		}
	}

	irAlEditarSala() {
		this.router.navigate([`/editar-sala`]);
	}

	irAlPartido() {
		this.router.navigate([`/partido`]);
	}
	
	async abrirModal() {
		this.menuCtrl.close();
		const modal = await this.modalController.create({
		  component: AyudaMenuLateralPage,
		  cssClass:'modal-css',
		  swipeToClose:true,
		  presentingElement: await this.modalController.getTop()

		});
		await modal.present();
	}

	mezclarEquipos(arr1, arr2) {
		let arrAux = [
			...arr1.filter(e => e.nombre != " (vacío) "), 
			...arr2.filter(e => e.nombre != " (vacío) ")
		];
		var currentIndex = arrAux.length, temporaryValue, randomIndex
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex -= 1
			temporaryValue = arrAux[currentIndex]
			arrAux[currentIndex] = arrAux[randomIndex]
			arrAux[randomIndex] = temporaryValue
		}
		// Ahora en arrAux están todos los jugadores mezclados
		for (let i = arrAux.length; i < 10; i++) arrAux.push(this.jugadorVacio)
		this.equipoRed = []
		this.equipoBlue = []
		for (let i = 0; i < 5; i++) {
			if (Math.random() > 0.5) {
				this.equipoRed.push(arrAux[2*i])
				this.equipoBlue.push(arrAux[2*i + 1])
			} else {
				this.equipoBlue.push(arrAux[2*i])
				this.equipoRed.push(arrAux[2*i + 1])
			}
		}
		return arrAux
	}

	pagar() {
		console.log("pagado en el banco de mentiritas, cantidad: ${123}")
	}

	abandonarSala() {
		this.router.navigate(['/buscar']);
		// console.log("Falta navegación a /buscar y en un futuro reembolsos")
	}
}

