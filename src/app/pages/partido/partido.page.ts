import { Component, OnInit } from '@angular/core';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Storage } from '@ionic/storage-angular';
import { Jugador } from 'src/app/models/jugador';
import { Cancha } from 'src/app/models/cancha';

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
  votosSalir = 5

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

  constructor(
    private storage: Storage,
		public firebaseauthService: FirebaseauthService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
		//let cancha = this.router.getCurrentNavigation().extras.state.cancha;
		this.storage.get('cancha').then(cancha => {
			this.salaDireccion = cancha.direccion;
			this.salaPrecio = cancha.precio;
			this.storage.get("sala").then(sala => {
				this.equipoRed = sala.equipoRed;
				this.equipoBlue = sala.equipoBlue;
				this.salaNombre = sala.nombre;
				console.log(sala.estado)
				this.salaEstado = (sala.estado == ' Sala pública ') ? 'público 🔓' : 'privado 🔐';
				this.salaSexo = (sala.sexo == ' No binario ') ? 'Mixto' : sala.sexo
				this.storage.get("jugador").then(jugador => {
					(Math.random() > 0.5) ? this.equipoRed.push(jugador) : this.equipoBlue.push(jugador)
	
					for (let i=this.equipoRed.length; i<5; i++) this.equipoRed.push(this.jugadorVacio)
					for (let i=this.equipoBlue.length; i<5; i++) this.equipoBlue.push(this.jugadorVacio)
				})
			})
		})
		this.descargarJugadores()
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

  nextSegundo() {
    setTimeout(() => {
      if (this.partidoSegundos++ === 60) {
        this.partidoSegundos = 0
        this.partidoMinutos++
        if (this.partidoMinutos < 60) this.nextSegundo();
      } 
		}, 1000);
	}
}
