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
  votoEmitido = false;

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

  constructor(
    private storage: Storage,
		public firebaseauthService: FirebaseauthService,
		private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
		this.storage.get('cancha').then(cancha => {
			this.salaDireccion = cancha.direccion;
			this.salaPrecio = cancha.precio;
			this.storage.get("sala").then(sala => {
				this.equipoRed = sala.equipoRed;
				this.equipoBlue = sala.equipoBlue;
				this.salaNombre = sala.nombre;
				this.salaEstado = (sala.estado == ' Sala pública ') ? 'público 🔓' : 'privado 🔐';
				this.salaSexo = (sala.sexo == ' No binario ') ? 'Mixto' : sala.sexo
				this.storage.get("jugador").then(jugador => {
					(Math.random() > 0.5) ? this.equipoRed.push(jugador) : this.equipoBlue.push(jugador)
	
					for (let i=this.equipoRed.length; i<5; i++) this.equipoRed.push(this.jugadorVacio)
					for (let i=this.equipoBlue.length; i<5; i++) this.equipoBlue.push(this.jugadorVacio)
					//this.llenarConBots()
					this.equipoRed.splice(2,1)
					this.iniciarStars()
				})
			})
		})
		this.descargarJugadores()
	}

  irAlInicio() {
    this.router.navigate([`/inicio`]);
  }

  descargarJugadores() {
		this.arrJugadores = [];
		this.jugadoresSubscription = this.firebaseauthService.getDocumentById('Puentes', 'bridge-jugadores').subscribe((idsJugadores: any) =>{
			for (let i in idsJugadores.jugadores) {
				this.jugSubscription = this.firebaseauthService.getDocumentById('Jugador', idsJugadores.jugadores[i]).subscribe((jugDocument: any) =>{
					this.arrJugadores.push(jugDocument)
					this.jugSubscription.unsubscribe()
				})
			}
			this.jugadoresSubscription.unsubscribe();
		})
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

 /*  llenarConBots() {
    this.equipoRed[2] = {nombre: "Nicolas", cantidad_votos: 1}
    this.equipoBlue[2] = {nombre: "Mariana", cantidad_votos:1};
    this.equipoRed[3] = {nombre: "Riki", cantidad_votos:1};
    this.equipoBlue[3] = {nombre: "Mario", cantidad_votos:1};
    this.equipoRed[4] = {nombre: "Gimena", cantidad_votos:1};
    this.equipoBlue[4] = {nombre: "Andrea", cantidad_votos:1};
  } */

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
