import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Storage } from '@ionic/storage-angular';
import { Jugador } from 'src/app/models/jugador';
import { Router } from '@angular/router';

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
  partidoSegundos = 0
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
	jugadores = []
	idsJugadores = []

	constructor(
		private storage: Storage,
			public firebaseauthService: FirebaseauthService,
			private router: Router
	) { }

	ngOnInit() {
	}

	ionViewWillEnter() {
		this.actualizarJugadoresDeLaSala()
		this.nextSegundo()
	}

	irAlPospartido() {
		this.router.navigate([`/pospartidoadmin`]);
	}

  	actualizarJugadoresDeLaSala() {
		this.storage.get('partido')
		.then((partido) => {
			this.partido = partido; 
			let {idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10} = this.partido
			this.idsJugadores = [idJug1, idJug2, idJug3, idJug4, idJug5, idJug6, idJug7, idJug8, idJug9, idJug10]
			this.salaNombre = this.partido.cancha.nombreCancha
			this.salaDireccion = this.partido.cancha.direccion
			this.salaPrecio = this.partido.cancha.precio
			this.salaEstado = ' Sala Pública '
			this.salaSexo = this.partido.sexo
			this.jugadores = []
			for (let i=0; i<10; i++) {
				if (this.idsJugadores[i] !== 0) {
					let requestSql = 'https://backend-f1-java.herokuapp.com/jugadores/' + this.idsJugadores[i] 
					fetch(requestSql)
					.then(res => res.json())
					.then(data => {
						let jugador = data;
						let scoreStars = jugador.puntaje / jugador.cantidad_votos
						this.fillStars(jugador, scoreStars)
						this.jugadores.push(jugador)
						this.repartirEquiposRedYBlue(this.jugadores)
					})
				}
			}
		}).catch(() => console.error("Error al recuperar la info del partido"));
	}

  	repartirEquiposRedYBlue(jugs) {
		// en el orden que están, se reparte uno para red, otro blue, otro red, otro blue y así
		// por lo tanto, índices impares quedarían en el lado red, pares quedarían en el lado blue
		this.equipoRed = []
		this.equipoBlue = []
		jugs.forEach((j, i) => i%2==0 ? this.equipoRed.push(j) : this.equipoBlue.push(j))
		for (let i=0; i<5; i++) 
			if (!this.equipoRed[i]) this.equipoRed.push({nombre: " (disponible) "})
		for (let i=0; i<5; i++) 
			if (!this.equipoBlue[i]) this.equipoBlue.push({nombre: " (disponible) "})
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
			if (this.partidoMinutos < 60) this.nextSegundo();
		}, 1000);
	}
  
  avanzarCronometro() { // es el boton de "ayuda"
    if (this.partidoMinutos < 10) {
      this.partidoMinutos = 10
      this.partidoSegundos = 13
      //this.llenarConBots(false)
    } else {
      this.partidoMinutos = 59
      this.partidoSegundos = 38
      //this.llenarConBots(true)
    }
  }
  
  votarSalir() {
    this.equipoRed[2].voto = true
    this.votosSalir++
    document.getElementById("boton-voto").style.color = 'lime'
    setTimeout(() => {
      this.irAlPospartido()
    }, 2500)
  }
}
