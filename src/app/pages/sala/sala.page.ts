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
		nombre: " (disponible) ",
		puntaje: 0,
		cantidad_votos: 0,
		pagado: false,
		stars: []
	}
	equipoRed = [];
	equipoBlue = [];
	stars: any[];
	enlaceMP = new Response();

	partido
	jugador
	jugadores = []

	constructor(
		public menuCtrl: MenuController,
		private modalController: ModalController,
		private router: Router,
		public firebaseauthService: FirebaseauthService,
		private storage: Storage,
		private socialSharing: SocialSharing,
		private mercadoPagoService: MercadopagoService
	) {
		this.storage.get('jugador')
		.then(jugador => this.jugador = jugador)
		.catch(() => console.error("Error al recuperar la info del jugador"));
	}

	ngOnInit() {}

	ionViewWillEnter() {
		// QUERY MODIFICAR EL PARTIDO PARA METER EL ID DE ESTE JUGADOR
		let requestSql = 'https://backend-f1-java.herokuapp.com/partido/' + this.jugador
		this.actualizarJugadoresDeLaSala()
	}

	ionViewWillLeave() {
		console.log("Saliendo de Sala, el partido del Storage tiene .idsJugadores como array")
	}
	
	irAlEditarSala() {
		this.storage.set("jugador", this.jugador)
		.then(() => this.storage.set("partido", this.partido)
			.then(() => this.router.navigate([`/editar-sala`])))
	}

	irAlPartido() {
		this.storage.set("jugador", this.jugador)
		.then(() => this.storage.set("partido", this.partido)
			.then(() => this.router.navigate([`/partido`])))
	}

	actualizarJugadoresDeLaSala() {
		this.storage.get('partido')
		.then((partido) => {
			this.partido = partido; 
			let {idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10} = this.partido
			this.partido.idsJugadores = [idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10]
			for (let i = 0; i < this.partido.idsJugadores.length; i++) {
				if (this.partido.idsJugadores[i] == 0) {
					this.partido.idsJugadores[i] = this.jugador.id
					break
				}				
			}
			this.salaNombre = this.partido.cancha.nombreCancha
			this.salaDireccion = this.partido.cancha.direccion
			this.salaPrecio = this.partido.cancha.precio
			this.salaEstado = ' Sala Pública '
			this.salaSexo = this.partido.sexo
			this.jugadores = []
			for (let i=0; i<10; i++) {
				if (this.partido.idsJugadores[i] !== 0) {
					let requestSql = 'https://backend-f1-java.herokuapp.com/jugadores/' + this.partido.idsJugadores[i] 
					fetch(requestSql)
					.then(res => res.json())
					.then(data => {
						let jugador = data;
						let scoreStars = (jugador.puntaje / jugador.cantVotos)
						this.fillStars(jugador, scoreStars)
						this.jugadores[i] = jugador
						this.repartirEquiposRedYBlue(this.jugadores)
					})
				} 
			}
		}).catch(() => console.error("Error al recuperar la info del partido"));
	}

	repartirEquiposRedYBlue(jugs) {
		this.equipoRed = []
		this.equipoBlue = []
		let idsFiltradas = this.partido.idsJugadores.filter(id => id !== 0)
		for (let i = 0; i < idsFiltradas.length; i++) {
			let idplayer = this.partido.idsJugadores[i];
			let player = jugs.find(p => p.idjugador == idplayer)
			if (i % 2 == 0) this.equipoRed.push(player) 
			else this.equipoBlue.push(player)
		}
		for (let i=0; i<5; i++) if (!this.equipoRed[i]) {
			this.equipoRed[i] = {nombre: " (disponible) "}
		}
		for (let i=0; i<5; i++) if (!this.equipoBlue[i]) {
			this.equipoBlue[i] = {nombre: " (disponible) "}
		}
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
			...arr1.filter(e => e.nombre != " (disponible) "), 
			...arr2.filter(e => e.nombre != " (disponible) ")
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
		this.jugador.pagado = Math.abs(this.jugador.pagado - 1)
		let indexJugador = this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id)
		this.jugadores[indexJugador].pagado = this.jugador.pagado
		console.log(this.jugadores[indexJugador].nombre)
		console.log(this.jugadores)
		this.repartirEquiposRedYBlue(this.jugadores)
	}

	abandonarSala() {
		this.storage.set("jugador", this.jugador)
		.then(() => this.storage.set("partido", {})
			.then(() => {
				// QUERY MODIFICAR EL PARTIDO PARA SACAR EL ID DE ESTE JUGADOR
				this.router.navigate([`/buscar`]);
      		})
		)
	}
}

