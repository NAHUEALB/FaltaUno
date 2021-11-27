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

  constructor(
    private storage: Storage,
		public firebaseauthService: FirebaseauthService,
		private router: Router
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
          this.llenarConBots(false)
				})
			})
		})
    this.nextSegundo()
		this.descargarJugadores()
	}

  irAlPospartido() {
    this.router.navigate([`/pospartidoadmin`]);
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
      this.llenarConBots(false)
    } else {
      this.partidoMinutos = 59
      this.partidoSegundos = 38
      this.llenarConBots(true)
    }
  }

  llenarConBots(voto = false) {
    console.log("llenando de bots con voto " + voto)
    console.log(this.equipoRed.length, this.equipoBlue.length)
    this.equipoBlue[2] = {nombre: "Mariana", voto: voto};
    this.equipoRed[3] = {nombre: "Riki", voto: voto};
    this.equipoBlue[3] = {nombre: "Mario", voto: false};
    this.equipoRed[4] = {nombre: "Gimena", voto: false};
    this.equipoBlue[4] = {nombre: "Andrea", voto: voto};
    this.equipoRed[0].voto = voto;
    this.equipoBlue[1].voto = voto;
    this.votosSalir = voto ? 5 : 0
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
