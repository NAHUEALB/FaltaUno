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
import { AyudaPagoPage } from '../ayuda-pago/ayuda-pago.page';
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
	delayEntreRefresh = 1500000
	mantenerActualizado = true

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
	jugadorAux
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
		this.mantenerActualizado = true
		this.actualizarSala()
	}

	ionViewWillLeave() {
		this.mantenerActualizado = false
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
	
	async abandonarSala() {
		let idPartido = (await this.storage.get("partido")).idpartido
		this.partido = await this.descargarPartido(idPartido)
		
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
		await this.actualizarJugador(dataSqlJugador)
		this.jugador.pagado = 0

		// QUERY MODIFICAR PARTIDO PARA LIMPIAR EL ID DEL idJugN QUE CORRESPONDA
		let {idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10} = this.partido
		this.partido.idsJugadores = [idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10]
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
		await this.actualizarPartido(dataSqlPartido)
		await this.storage.set("jugador", this.jugador)
		await this.storage.set("partido", {})
		this.router.navigate([`/buscar`])
	}

	async descargarPartido(idPartido) {
		let path = '/partidos/' + idPartido
		let partidoSql = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cDESCARGAR PARTIDO ACTUALIZADO [" + idPartido + "] -----> " + path,
			"color:green; background-color: lime; font-size: 16px; font-weight: bold;"
		)
		return await (await fetch(partidoSql)).json()
	}

	async descargarJugador(idJugador) {
		let path = '/jugadores/' + idJugador
		let partidoSql = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cDESCARGAR JUGADOR ACTUALIZADO [" + idJugador + "] -----> " + path,
			"color:green; background-color: lime; font-size: 16px; font-weight: bold;"
		)
		return await (await fetch(partidoSql)).json()
	}

	async actualizarJugador(jugadorActualizado) {
		let path = '/jugadores/actualizar'
		let requestSqlJugador = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cREEMBOLSAR PAGO DEL JUGADOR [" + jugadorActualizado.nombre + "] -----> " + path,
			"color:white; background-color: red; font-size: 16px; font-weight: bold;"
		)
		return await (await fetch(requestSqlJugador, {
			method: "PUT", 
			body: JSON.stringify(jugadorActualizado),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})).json()
	}

	async actualizarPartido(partidoActualizado) {
		let path = '/partidos/actualizar'
		let requestSqlPartido = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cRETIRANDO JUGADOR DEL PARTIDO [" + partidoActualizado.idpartido + "] -----> " + path,
			"color:black; background-color: yellow; font-size: 16px; font-weight: bold;"
		)
		return await (await fetch(requestSqlPartido, {
			method: "PUT", 
			body: JSON.stringify(partidoActualizado),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})).json()
	}
	
	async actualizarSala() {
		let idPartido = (await this.storage.get("partido")).idpartido
		this.partido = await this.descargarPartido(idPartido)

		this.salaNombre = this.partido.cancha.nombreCancha
		this.salaDireccion = this.partido.cancha.direccion
		this.salaPrecio = this.partido.cancha.precio
		this.salaEstado = ' Sala Pública '
		this.salaSexo = this.partido.sexo
		let {idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10} = this.partido
		this.partido.idsJugadores = [idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10]
		let indexAInsertar
		if (this.jugador.id && !this.partido.idsJugadores.includes(this.jugador.id)) {
			indexAInsertar = this.partido.idsJugadores.indexOf(0)
			this.partido.idsJugadores[indexAInsertar] = this.jugador.id
		}

		this.jugadores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		let c_jugadores = 0
		this.partido.idsJugadores.forEach(id => id != 0 ? c_jugadores++ : "");
		let c_jugadores_no_nulos = 0

		let actualizadoEnHeroku = false
		for (let i=0; i<10; i++) {
			if (this.partido.idsJugadores[i] !== 0) {
				this.jugadorAux = await this.descargarJugador(this.partido.idsJugadores[i])
				c_jugadores_no_nulos++
				let scoreStars = (this.jugadorAux.puntaje / this.jugadorAux.cantVotos)
				this.fillStars(this.jugadorAux, scoreStars)
				this.jugadores[i] = this.jugadorAux
				if (c_jugadores == c_jugadores_no_nulos) {
					actualizadoEnHeroku = true
					this.repartirRedYBlue(actualizadoEnHeroku) 
					setTimeout(() => {
						if (this.mantenerActualizado) this.actualizarSala()
					}, this.delayEntreRefresh);
				} 
			}
		}
		!actualizadoEnHeroku && this.repartirRedYBlue(true)
	}

	repartirRedYBlue(updatePartido = false) {
		this.equipoRed = [] 
		this.equipoBlue = []
		let idsFiltradas = this.jugadores
		.filter(jug => jug.idjugador)
		.map(jug => jug.idjugador)
		for (let i = 0; i < idsFiltradas.length; i++) {
			let idplayer = idsFiltradas[i];
			for (let j = 0; j < this.jugadores.length; j++) {
				let player = this.jugadores[j];
				if (player && player.idjugador == idplayer)
					if (i % 2 == 0) 
						this.equipoRed.push(player) 
					else 
						this.equipoBlue.push(player)
			}
		}
		for (let i=0; i<5; i++) 
			if (!this.equipoRed[i]) this.equipoRed[i] = {nombre: " (disponible) "}
		for (let i=0; i<5; i++) 
			if (!this.equipoBlue[i]) this.equipoBlue[i] = {nombre: " (disponible) "}

		this.actualizarPartidoDesdeJugadores()
		updatePartido && this.updateJugadoresSql()
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

	updateJugadoresSql() {
		let dataSqlPartido = {
			idpartido: this.partido.idpartido,
			idcancha: this.partido.cancha.idcancha,
			idJug1: this.partido.idJug1 || 0,
			idJug2: this.partido.idJug2 || 0,
			idJug3: this.partido.idJug3 || 0,
			idJug4: this.partido.idJug4 || 0,
			idJug5: this.partido.idJug5 || 0,
			idJug6: this.partido.idJug6 || 0,
			idJug7: this.partido.idJug7 || 0,
			idJug8: this.partido.idJug8 || 0,
			idJug9: this.partido.idJug9 || 0,
			idJug10: this.partido.idJug10 || 0,
			hora: this.partido.hora,
			sexo: this.partido.sexo,
			sala: this.partido.sala
		} 
		let path = '/partidos/actualizar'
		let requestSqlPartido = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cACT JUGADORES DEL PARTIDO ID [" + dataSqlPartido.idpartido + "] -----> " + path,
			"color:brown; background-color: cyan; font-size: 16px; font-weight: bold;"
		)
		fetch(requestSqlPartido, {
			method: "PUT", 
			body: JSON.stringify(dataSqlPartido),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})
		.then(res => res.json())
		.then(() => this.presentToast("Se actualizó la información del partido ✅", 700))
		.catch(err => this.presentToast("💀 La última modificación al partido no logró completarse con éxito", 3000))
	}

	pagar() {
		let indexJugador = this.partido.idsJugadores.findIndex(idplayer => idplayer == this.jugador.id)
		this.jugadores[indexJugador].pagado == 0 && this.abrirModalPago()
		this.jugadores[indexJugador].pagado = 1
		this.jugador.pagado = 1
		this.repartirRedYBlue()

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
		let path = '/jugadores/actualizar'
		let requestSqlJugador = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cACTUALIZAR JUGADOR SI PAGÓ [" + dataSqlJugador.nombre + "] -----> " + path,
			"color:white; background-color: green; font-size: 16px; font-weight: bold;"
		)
		fetch(requestSqlJugador, {
			method: "PUT", 
			body: JSON.stringify(dataSqlJugador),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})
		.then(res => res.json())
		.then(() => this.presentToast("Se registró tu pago correctamente ✅", 1000))
		.catch(() => this.presentToast("💀 Hubo un error registrando tu pago", 5000))
	}

	async abrirModalPago() {
		const modal = await this.modalController.create({
			component: AyudaPagoPage,
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
		  component: AyudaPage,
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

