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
	}

	irAlInicio() {
		this.router.navigate([`/inicio`]);
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

  votarJugador(cantidad) {
    console.error("click en la estrella " + cantidad)
    this.fillStars(this.equipoRed[0], cantidad)
  }

}
