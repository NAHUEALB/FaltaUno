import { ModalController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { ToastController } from '@ionic/angular';
import { Jugador } from 'src/app/models/jugador';
import { Cancha } from 'src/app/models/cancha';
import { Sala } from 'src/app/models/sala';
import { AyudaMenuLateralPage } from '../ayuda-menu-lateral/ayuda-menu-lateral.page';
import { MercadopagoService } from 'src/app/serv/mercadopago.service';
import { Item, Request, Response } from 'src/app/models/request.model';
import { AyudaPage } from '../ayuda/ayuda.page';
import { PartidoPage } from '../partido/partido.page';
import { HOST_ATTR } from '@angular/compiler';

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
		public toastController: ToastController,
		private socialSharing: SocialSharing,
		private mercadoPagoService: MercadopagoService
	) {
		this.storage.get('jugador')
		.then(jugador => this.jugador = jugador)
		.catch(() => console.error("Error al recuperar la info del jugador"));
	}

	ngOnInit() {}

	ionViewWillEnter() {
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
			this.jugadores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			let c_jugadores = 0
			this.partido.idsJugadores.forEach(id => id != 0 ? c_jugadores++ : "");
			let c_jugadores_no_nulos = 0
			for (let i=0; i<10; i++) {
				if (this.partido.idsJugadores[i] !== 0) {
					let requestSql = 'https://backend-f1-java.herokuapp.com/jugadores/' + this.partido.idsJugadores[i] 
					fetch(requestSql)
					.then(res => res.json())
					.then(data => {
						c_jugadores_no_nulos++
						let jugador = data;
						let scoreStars = (jugador.puntaje / jugador.cantVotos)
						this.fillStars(jugador, scoreStars)
						this.jugadores[i] = jugador
						if (c_jugadores == c_jugadores_no_nulos) this.repartirEquiposRedYBlue(true) 
						else this.repartirEquiposRedYBlue()
					})
				}
				i == 9 && this.repartirEquiposRedYBlue()
			}
		}).catch(() => console.error("Error al recuperar la info del partido"));
	}

	repartirEquiposRedYBlue(updatePartido = false) {
		// esta función actualiza los equipos red y blue, que son los elementos
		// a los que recurre el front para renderizar la información en pantalla
		this.equipoRed = []
		this.equipoBlue = []
		let idsFiltradas = this.jugadores.filter(jug => jug.idjugador !== 0).map(jug => jug.idjugador)
		for (let i = 0; i < idsFiltradas.length; i++) {
			let idplayer = idsFiltradas[i];
			for (let j = 0; j < this.jugadores.length; j++) {
				const player = this.jugadores[j];
				if (player && player.idjugador == idplayer)
					if (i % 2 == 0) this.equipoRed.push(player) 
					else this.equipoBlue.push(player)
			}
		}
		for (let i=0; i<5; i++) 
			if (!this.equipoRed[i]) this.equipoRed[i] = {nombre: " (disponible) "}
		for (let i=0; i<5; i++) 
			if (!this.equipoBlue[i]) this.equipoBlue[i] = {nombre: " (disponible) "}

		this.actualizarPartidoDesdeJugadores()
		updatePartido && this.updateJugadoresSql()
	}

	updateJugadoresSql() {
		let dataSqlPartido = {
			idpartido: this.partido.idpartido,
			idcancha: this.partido.cancha.idcancha,
			idJug1: this.jugadores[0].idjugador || 0,
			idJug2: this.jugadores[1].idjugador || 0,
			idJug3: this.jugadores[2].idjugador || 0,
			idJug4: this.jugadores[3].idjugador || 0,
			idJug5: this.jugadores[4].idjugador || 0,
			idJug6: this.jugadores[5].idjugador || 0,
			idJug7: this.jugadores[6].idjugador || 0,
			idJug8: this.jugadores[7].idjugador || 0,
			idJug9: this.jugadores[8].idjugador || 0,
			idJug10: this.jugadores[9].idjugador || 0,
			hora: this.partido.hora,
			sexo: this.partido.sexo,
			sala: this.partido.sala
		} 
		let requestSqlPartido = 'https://backend-f1-java.herokuapp.com/partidos/actualizar/'
		console.log("ENVIANDO ", dataSqlPartido, " A ", requestSqlPartido)
		fetch(requestSqlPartido, {
			method: "PUT", 
			body: JSON.stringify(dataSqlPartido),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})
		.then(res => res.json())
		.then(() => this.presentToast("Se actualizó la información del partido ✅", 3000))
		.catch(err => this.presentToast("💀 La última modificación al partido no logró completarse con éxito", 3000))
	}

	actualizarPartidoDesdeJugadores() {
		this.partido.idJug1 = this.jugadores[0] ? this.jugadores[0].idjugador : 0
		this.partido.idJug2 = this.jugadores[1] ? this.jugadores[1].idjugador : 0
		this.partido.idJug3 = this.jugadores[2] ? this.jugadores[2].idjugador : 0
		this.partido.idJug4 = this.jugadores[3] ? this.jugadores[3].idjugador : 0
		this.partido.idJug5 = this.jugadores[4] ? this.jugadores[4].idjugador : 0
		this.partido.idJug6 = this.jugadores[5] ? this.jugadores[5].idjugador : 0
		this.partido.idJug7 = this.jugadores[6] ? this.jugadores[6].idjugador : 0
		this.partido.idJug8 = this.jugadores[7] ? this.jugadores[7].idjugador : 0
		this.partido.idJug9 = this.jugadores[8] ? this.jugadores[8].idjugador : 0
		this.partido.idJug10 = this.jugadores[9] ? this.jugadores[9].idjugador : 0
	}

	pagar() {
		let indexJugador = this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id)
		this.jugadores[indexJugador].pagado ? this.abrirModal() : this.abrirModalPago()
		this.jugadores[indexJugador].pagado = 1
		this.jugador.pagado = 1
		this.repartirEquiposRedYBlue()

		// QUERY MODIFICAR JUGADOR PARA PONERLE PAGADO = 1
		let dataSqlJugador = {
			idjugador: this.jugador.id,
			email: this.jugador.email,
			password: this.jugador.password,
			nombre: this.jugador.nombre,
			fnacimiento: this.jugador.fnacimiento,
			sexo: this.jugador.sexo,
			localidad: this.jugador.ubicacion,
			puntaje: this.jugador.puntaje,
			pagado: this.jugador.pagado,
			idFirebase: this.jugador.id_firebase,
			cantVotos: this.jugador.cantidad_votos,
		}
		let requestSqlJugador = 'https://backend-f1-java.herokuapp.com/jugadores/actualizar'
		console.log("ENVIANDO ", dataSqlJugador, " A ", requestSqlJugador)
		fetch(requestSqlJugador, {
			method: "PUT", 
			body: JSON.stringify(dataSqlJugador),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})
		.then(res => res.json())
		.then(() => this.presentToast("Se registró tu pago correctamente ✅", 3000))
		.catch(() => this.presentToast("💀 Hubo un error registrando tu pago", 5000))
	}

	abandonarSala() {
		this.jugador.pagado = 0
		console.log(this.partido)	
		this.storage.set("jugador", this.jugador)
		.then(() => this.storage.set("partido", {})
			.then(() => {
				// QUERY MODIFICAR JUGADOR PARA PONERLE PAGADO = 0
				let dataSqlJugador = {
					idjugador: this.jugador.id,
					email: this.jugador.email,
					password: this.jugador.password,
					nombre: this.jugador.nombre,
					fnacimiento: this.jugador.fnacimiento,
					sexo: this.jugador.sexo,
					localidad: this.jugador.ubicacion,
					puntaje: this.jugador.puntaje,
					pagado: 0,
					idFirebase: this.jugador.id_firebase,
					cantVotos: this.jugador.cantidad_votos,
				}
				let requestSqlJugador = 'https://backend-f1-java.herokuapp.com/jugadores/actualizar'
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
						idcancha: this.partido.cancha.idcancha,
						idpartido: this.partido.idpartido,
						idJug1: indexJugador == 0 ? 0 : this.jugadores[0].idjugador || 0,
						idJug2: indexJugador == 1 ? 0 : this.jugadores[1].idjugador || 0,
						idJug3: indexJugador == 2 ? 0 : this.jugadores[2].idjugador || 0,
						idJug4: indexJugador == 3 ? 0 : this.jugadores[3].idjugador || 0,
						idJug5: indexJugador == 4 ? 0 : this.jugadores[4].idjugador || 0,
						idJug6: indexJugador == 5 ? 0 : this.jugadores[5].idjugador || 0,
						idJug7: indexJugador == 6 ? 0 : this.jugadores[6].idjugador || 0,
						idJug8: indexJugador == 7 ? 0 : this.jugadores[7].idjugador || 0,
						idJug9: indexJugador == 8 ? 0 : this.jugadores[8].idjugador || 0,
						idJug10: indexJugador == 9 ? 0 : this.jugadores[9].idjugador || 0,
						hora: this.partido.hora,
						sexo: this.partido.sexo,
						sala: this.partido.sala
					} 
					let requestSqlPartido = 'https://backend-f1-java.herokuapp.com/partidos/actualizar'
					console.log("ENVIANDO ", dataSqlPartido, " A ", requestSqlPartido)
					fetch(requestSqlPartido, {
						method: "PUT", 
						body: JSON.stringify(dataSqlPartido),
						headers: {"Content-type": "application/json; charset=UTF-8"}
					})
					.then(res => res.json())
					.then(() => this.router.navigate([`/buscar`]))
				})
      		})
		)
	}

	async abrirModalPago() {
		const modal = await this.modalController.create({
			component: AyudaPage,
			cssClass: 'modal-css',
			swipeToClose: true,
			presentingElement: await this.modalController.getTop(),
			componentProps: {
				'enlaceMP': this.enlaceMP.sandbox_init_point
			}, 
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

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}
}

