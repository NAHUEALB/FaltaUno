import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Storage } from '@ionic/storage-angular';
import { Jugador } from 'src/app/models/jugador';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
})
export class PartidoPage implements OnInit {

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
	partidoMinutos = 0
	partidoMinutosText
	partidoSegundos = 0
	partidoSegundosText
	votosSalir = 0
	votoEmitido = false // FALTA IMPLEMENTAR

	idsFirebaseBots = [];
	arrJugadores: Jugador[] = [];
	
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
	partido
	jugador
	jugadorAux
	jugadores = []
	idsJugadores = []

	mantenerActualizado = false
	delayEntreRefresh = 0

	constructor(
		private storage: Storage,
		public firebaseauthService: FirebaseauthService,
		private router: Router,
		public toastController: ToastController
	) { 
		this.storage.get('jugador').then(jugador => {
			this.jugador = jugador
			this.storage.get('partido').then(partido => {
				this.partido = partido
				this.storage.get('jugadores').then(jugadores => {
					this.jugadores = jugadores
				})
			})
		})
		.catch(() => console.error("Error al recuperar la info del jugador"));
	}

	ngOnInit() {
	}

	ionViewWillEnter() {
		this.actualizarSala()
		this.nextSegundo()
	}

	async irAlPospartido() {
		await this.storage.set("jugadores", this.jugadores)
		this.router.navigate([`/pospartido`])
	}

	async actualizarSala() {
		this.jugadores = await this.storage.get("jugadores")
		this.partido = await this.storage.get("partido")
		this.salaNombre = this.partido.cancha.nombreCancha
		this.salaDireccion = this.partido.cancha.direccion
		this.salaPrecio = this.partido.cancha.precio
		this.salaEstado = ' Sala Pública '
		this.salaSexo = this.partido.sexo
		let {idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10} = this.partido
		this.partido.idsJugadores = [idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10]
		this.repartirRedYBlue() 
	}

	repartirRedYBlue() {
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
					(i % 2 == 0) ? this.equipoRed.push(player) : this.equipoBlue.push(player)
			}
		}
		for (let i=0; i<5; i++) 
			if (!this.equipoRed[i]) this.equipoRed[i] = {nombre: " (disponible) "}
		for (let i=0; i<5; i++) 
			if (!this.equipoBlue[i]) this.equipoBlue[i] = {nombre: " (disponible) "}
	}
	
  	fillStars(player, value) {
		player.stars = [];
		for (let i=0; i<5; i++) {
			if (value - .75 >= i) player.stars.push("full")
			else if (value - .25 >= i) player.stars.push("half")
			else player.stars.push("null");
		}
	}

  	nextSegundo() {
		setTimeout(() => {
			this.partidoSegundos++
			if (this.partidoSegundos === 60) {
				this.partidoSegundos = 0
				this.partidoMinutos++
			}
			if (this.partidoMinutos < 60) {
				this.nextSegundo();
				this.partidoSegundosText = this.partidoSegundos<10 ? "0"+this.partidoSegundos : this.partidoSegundos
				this.partidoMinutosText = this.partidoMinutos<10 ? "0"+this.partidoMinutos : this.partidoMinutos
			} else {
				this.partidoMinutosText = ":¡FINALIZADO!"
				this.partidoSegundosText = ""
			}
		}, 1000);
	}
  
	avanzarCronometro() { // es el boton de "ayuda"
		if (this.partidoMinutos < 10) {
		this.partidoMinutos = 10
		this.partidoSegundos = 13
		} else {
		this.partidoMinutos = 59
		this.partidoSegundos = 38
		}
	}
	
	votarSalir() {
		document.getElementById("boton-voto").style.color = 'lime'
		this.presentToast("Saliendo del partido para ir a la sección de feedback ✅", 3000)
		setTimeout(() => this.irAlPospartido(), 2500)
	}

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}
}
