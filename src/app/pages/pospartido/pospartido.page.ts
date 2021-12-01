import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Storage } from '@ionic/storage-angular';
import { Jugador } from 'src/app/models/jugador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pospartido',
  templateUrl: './pospartido.page.html',
  styleUrls: ['./pospartido.page.scss'],
})
export class PospartidoPage implements OnInit {
  	enlace = 'Jugador';
	enlaceCanchasLP = 'CanchasLP';
	docSubscription;
	canchaSubscription;
	usuarioSubscription;
	jugadoresSubscription;
	jugSubscription;

  	salaNombre = 'Sala'
	salaDireccion = 'Esperando geolocalización'
	salaPrecio = 1800
	salaEstado = '...'
	salaSexo = '...'
	partido
  	votoEmitido = false;

	idsFirebaseBots = [];
	arrJugadores: Jugador[] = [];
	
	jugador
	jugadores
	jugadorVacio = {
		nombre: " (vacío) ",
		puntaje: 0,
		cantidad_votos: 0,
		pagado: false,
		stars: []
	}
	equipoRed = [];
	equipoBlue = [];
	stars: any[];
	votosRed = [null, null, null, null, null]
	votosBlue = [null, null, null, null, null]

	constructor(
		private storage: Storage,
			public firebaseauthService: FirebaseauthService,
			private router: Router
	) { 
		this.storage.get('jugador').then(jugador => {
			this.jugador = jugador
			this.storage.get('partido').then(partido => {
				this.partido = partido
				this.storage.get('jugadores').then(jugadores => {
					this.jugadores = jugadores
					this.repartirRedYBlue()
					this.iniciarStars()
				})
			})
		})
		.catch(() => console.error("Error al recuperar la info del jugador"));
	}

	ngOnInit() {
	}

	irAlInicio() {
		this.enviarVotos()
		console.log(this.votosRed, this.votosBlue)
		//this.router.navigate([`/inicio`]);
	}

  	ionViewWillEnter() {
		this.storage.get('jugadores').then(jugadores => {
			this.jugadores = jugadores
			this.storage.get('partido').then(partido => {
				this.partido = partido
				this.salaDireccion = this.partido.cancha.direccion;
				this.salaPrecio = this.partido.cancha.precio;
				this.salaNombre = this.partido.cancha.nombre;
				this.salaEstado = (this.partido.estado == ' Sala pública ') ? 'público 🔓' : 'privado 🔐';
				this.salaSexo = (this.partido.sexo == ' No binario ') ? 'Mixto' : this.partido.sexo
				this.repartirRedYBlue()
				this.iniciarStars()
			})
		})
		this.votosRed = [null, null, null, null, null]
		this.votosBlue = [null, null, null, null, null]
	}

	repartirRedYBlue() {
		this.equipoRed = [] 
		this.equipoBlue = []
		for (let j = 0; j < 10; j++) {
			console.log("JUGADOR A REPARTIR", this.jugadores[j])
			let player = this.jugadores[j];
			if (this.jugadores[j] && this.jugador.id !== this.jugadores[j].idjugador)
				(j % 2 == 0) ? this.equipoRed.push(player) : this.equipoBlue.push(player)
		}
	}

	getValoracion(puntos, votos) {
		if (votos != 0) return Number((puntos/votos).toFixed(2));
		return 0;
	}

	fillStars(player, value) {
		player.stars = [];
		for (let i=0; i<5; i++) {
			if (value >= i) player.stars.push("full")
			else player.stars.push("null")
		}
	}

	clickPositivo() {
		if (this.votoEmitido) return
		document.getElementById('boton-voto-up').style.color = 'lime'
		document.getElementById('boton-voto-up').style.transition = 'all 300ms'
		this.votoEmitido = true
	}

	clickNegativo() {
		if (this.votoEmitido) return
		document.getElementById('boton-voto-down').style.color = 'salmon'
		document.getElementById('boton-voto-down').style.transition = 'all 300ms'
		this.votoEmitido = true
	}

	iniciarStars() {
		this.equipoRed.forEach(jugador => jugador.stars = ["null", "null", "null", "null", "null"])
		this.equipoBlue.forEach(jugador => jugador.stars = ["null", "null", "null", "null", "null"])
	}

	votarJugadorEspecifico(jugador, cantidad, team) {
		console.log("click en el jugador " + jugador)
		console.log("click en la estrella " + cantidad)
		if (team === "red") {
			this.fillStars(this.equipoRed[jugador], cantidad)
			this.votosRed[jugador] = {id: this.equipoRed[jugador].idjugador, valor: cantidad-0+1}
		} else {
			this.fillStars(this.equipoBlue[jugador], cantidad)
			this.votosBlue[jugador] = {id: this.equipoBlue[jugador].idjugador, valor: cantidad-0+1}
		}
	}

	enviarVotos() {
		for (let i = 0; i < this.votosRed.length; i++){
			if (this.votosRed[i]) {
				this.descargarJugador(this.equipoRed[i].idjugador).then(jugador => {
					jugador.puntaje = Number(jugador.puntaje) + Number(this.votosRed[i].valor)
					console.log(this.votosRed[i].valor + " --> " + jugador.puntaje)
					jugador.cantVotos++
					this.actualizarJugador(jugador).then(() => {
						this.votosRed[i] = null
						if (this.equiposVacios()) this.abandonarSala()
					})
				})
			}
		}
		for (let i = 0; i < this.votosBlue.length; i++){
			if (this.votosBlue[i]) {
				this.descargarJugador(this.equipoBlue[i].idjugador).then(jugador => {
					jugador.puntaje = Number(jugador.puntaje) + Number(this.votosBlue[i].valor)
					console.log(this.votosBlue[i].valor + " --> " + jugador.puntaje)
					jugador.cantVotos++
					this.actualizarJugador(jugador).then(() => {
						this.votosBlue[i] = null
						if (this.equiposVacios()) this.abandonarSala()
					})
				})
			}
		}
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

	async descargarPartido(idPartido) {
		let path = '/partidos/' + idPartido
		let partidoSql = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cDESCARGAR PARTIDO ACTUALIZADO [" + idPartido + "] -----> " + path,
			"color:green; background-color: lime; font-size: 16px; font-weight: bold;"
		)
		return await (await fetch(partidoSql)).json()
	}

	async actualizarJugador(jugadorActualizado) {
		let path = '/jugadores/actualizar'
		let requestSqlJugador = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cASIGNANDO VOTO AL JUGADOR [" + jugadorActualizado.nombre + "] -----> " + path,
			"color:white; background-color: cyan; font-size: 16px; font-weight: bold;"
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
		this.router.navigate([`/inicio`])
	}

	equiposVacios() {
		let flag = true
		for (let i = 0; i < this.votosRed.length; i++) {
			if (this.votosRed[i]) return false
		}
		if (flag) for (let i = 0; i < this.votosBlue.length; i++) {
			if (this.votosBlue[i]) return false
		}
		return true
	}
}
