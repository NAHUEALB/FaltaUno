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
		let firstLoad = true
		this.actualizarJugadoresDeLaSala(firstLoad)
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

	async abrirModalPago() {
		const modal = await this.modalController.create({
			component: AyudaPage,
			cssClass: 'modal-css',
			swipeToClose: true,
			presentingElement: await this.modalController.getTop()
			/* componentProps: {
				'enlaceMP': this.enlaceMP.sandbox_init_point
			}, */
		});
		await modal.present();
	}

	async abrirModal() {
		//this.menuCtrl.close();
		const modal = await this.modalController.create({
		  component: AyudaMenuLateralPage,
		  cssClass:'modal-css',
		  swipeToClose:true,
		  presentingElement: await this.modalController.getTop()
		});
		await modal.present();
	}
	
	actualizarJugadoresDeLaSala(firstLoad = false) {
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
						if (firstLoad) {
							console.log("es primera carga:")
							console.log(this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id))
							//let indexJugador = this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id)
							//indexJugador != -1 && this.jugadores[indexJugador] ? this.jugadores[indexJugador].pagado = 0 : true;
						}
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
		let idsFiltradas = jugs.filter(jug => jug.idjugador !== 0).map(jug => jug.idjugador)
		for (let i = 0; i < idsFiltradas.length; i++) {
			let idplayer = idsFiltradas[i];
			for (let j = 0; j < jugs.length; j++) {
				const player = jugs[j];
				if (player && player.idjugador == idplayer)
					if (i % 2 == 0) this.equipoRed.push(player) 
					else this.equipoBlue.push(player)
			}
		}
		for (let i=0; i<5; i++) 
			if (!this.equipoRed[i]) this.equipoRed[i] = {nombre: " (disponible) "}
		for (let i=0; i<5; i++) 
			if (!this.equipoBlue[i]) this.equipoBlue[i] = {nombre: " (disponible) "}
	}

	pagar() {
		let indexJugador = this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id)
		this.jugadores[indexJugador].pagado ? this.abrirModal() : this.abrirModalPago()
		this.jugadores[indexJugador].pagado = 1
		this.jugador.pagado = 1
		this.repartirEquiposRedYBlue(this.jugadores)
	}

	abandonarSala() {
		this.jugador.pagado = 0
		this.storage.set("jugador", this.jugador)
		.then(() => this.storage.set("partido", {})
			.then(() => {
				if (false) {	
					// QUERY MODIFICAR JUGADOR PARA PONERLE PAGADO = 0
					let dataSqlJugador = this.jugador
					dataSqlJugador.pagado = 0
					let requestSqlJugador = 'https://backend-f1-java.herokuapp.com/modJugador/' + this.jugador.id
					console.log("ENVIANDO ", dataSqlJugador, " A ", requestSqlJugador)
					fetch(requestSqlJugador, {
						method: "PUT", 
						body: JSON.stringify(dataSqlJugador),
						headers: {"Content-type": "application/json; charset=UTF-8"}
					})
					.then(res => res.json())
					.then(() => {
						
						// QUERY MODIFICAR PARTIDO PARA LIMPIAR EL ID DEL idJugN QUE CORRESPONDA
						let indexJugador = this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id)
						let dataSqlPartido = {
							idJug1: indexJugador == 0 ? 0 : this.jugadores[0] || 0,
							idJug2: indexJugador == 1 ? 0 : this.jugadores[1] || 0,
							idJug3: indexJugador == 2 ? 0 : this.jugadores[2] || 0,
							idJug4: indexJugador == 3 ? 0 : this.jugadores[3] || 0,
							idJug5: indexJugador == 4 ? 0 : this.jugadores[4] || 0,
							idJug6: indexJugador == 5 ? 0 : this.jugadores[5] || 0,
							idJug7: indexJugador == 6 ? 0 : this.jugadores[6] || 0,
							idJug8: indexJugador == 7 ? 0 : this.jugadores[7] || 0,
							idJug9: indexJugador == 8 ? 0 : this.jugadores[8] || 0,
							idJug10: indexJugador == 9 ? 0 : this.jugadores[9] || 0
						} 
						let requestSqlPartido = 'https://backend-f1-java.herokuapp.com/modIdsPartido/' + this.partido.idpartido
						console.log("ENVIANDO ", dataSqlPartido, " A ", requestSqlPartido)
						fetch(requestSqlPartido, {
							method: "PUT", 
							body: JSON.stringify(dataSqlPartido),
							headers: {"Content-type": "application/json; charset=UTF-8"}
						})
						.then(res => res.json())
						.then(() => this.router.navigate([`/buscar`]))
					})
				} else {
					this.router.navigate([`/buscar`])
				}
      		})
		)
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
}

