import { ModalController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
	}
	equipoRed = [];
	equipoBlue = [];
	stars: any[];
	enlaceMP = new Response();

	constructor(
		public menuCtrl: MenuController,
		private modalController: ModalController,
		private router: Router,
		public firebaseauthService: FirebaseauthService,
		private storage: Storage,
		private socialSharing: SocialSharing,
		private mercadoPagoService: MercadopagoService
	) {}

	ngOnInit() {}

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
					this.equipoRed.push(jugador)
	
					for (let i=this.equipoRed.length; i<5; i++) this.equipoRed.push(this.jugadorVacio)
					for (let i=this.equipoBlue.length; i<5; i++) this.equipoBlue.push(this.jugadorVacio)
	
					this.equipoRed.concat(this.equipoBlue).forEach(p => {
						let valoracion = this.getValoracion(p.puntaje, p.cvotos);
						this.fillStars(p, valoracion);
					});
				})
			})
		})
		this.descargarJugadores()
	}


	socialShare(){
		let options = {
			message: 'Unete a mi partido: ', 
			url: 'https://faltauno.com/id/jVHAsL',
		  };
		this.socialSharing.shareWithOptions(options);
	}


	
	pagarMP(){
		let item : Item = new Item();
		item.title = "Partido";
		item.description = "Cancha 2";
		item.category_id = "cat123";
		item.picture_url = "http://www.myapp.com/myimage.jpg";
		item.quantity = 1;
		item.currency_id = "ARS"
		item.unit_price = 180;

		let request : Request = new Request();
		request.items.push(item);
		this.mercadoPagoService.requestHttp(request).then((rsp:any) =>{
			this.enlaceMP.sandbox_init_point = rsp;
			console.log(this.enlaceMP.sandbox_init_point);
			this.abrirModalPago();
		});
	}

	async abrirModalPago() {
		const modal = await this.modalController.create({
			component: AyudaPage,
			cssClass: 'modal-css',
			componentProps: {
				'enlaceMP': this.enlaceMP.sandbox_init_point
			  },
			swipeToClose: true,
			presentingElement: await this.modalController.getTop()
		});
		await modal.present();
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

	irAlEditarSala() {
		this.router.navigate([`/editar-sala`]);
	}

	irAlPartido() {
		this.router.navigate([`/partido`]);
	}
	
	async abrirModal() {
		this.menuCtrl.close();
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
			...arr1.filter(e => e.nombre != " (vacío) "), 
			...arr2.filter(e => e.nombre != " (vacío) ")
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

	pagar() {
		console.log("pagado en el banco de mentiritas, cantidad: ${123}")
	}

	invitarPorRRSS() {
		console.log("Envía este link: https://jajacualquiera.com/invite")
	}

	abandonarSala() {
		this.router.navigate(['/buscar']);
		// console.log("Falta navegación a /buscar y en un futuro reembolsos")
	}

	crearFirebaseBot(cantidad) {
		var arrNombres = ["Adrián", "Agustín", "Alberto", "Alejandro", "Alexander", "Alexis", "Alonso", "Ángel", "Anthony", "Antonio", "Bautista", "Benicio", "Benjamín", "Carlos", "César", "Cristóbal", "Daniel", "David", "Diego", "Dylan", "Eduardo", "Emiliano", "Emmanuel", "Enrique", "Erik", "Ernesto", "Ethan", "Fabián", "Facundo", "Felipe", "Félix", "Fernando", "Francisco", "Gabriel", "Gaspar", "Hugo", "Ian", "Iker", "Isaac", "Jacob", "Javier", "Jayden", "Jeremy", "Jerónimo", "Jesús", "Joaquín", "Jorge", "José", "José Antonio", "Josué", "Juan", "Julio", "Justin", "Kevin", "Lautaro", "Liam", "Lian", "Lorenzo", "Lucas", "Luis", "Manuel", "Mario", "Martín", "Mateo", "Matías", "Maximiliano", "Maykel", "Miguel", "Miguel  ngel", "Nelson", "Noah", "Oscar", "Pablo", "Pedro", "Rafael", "Ramón", "Raúl", "Ricardo", "Rigoberto", "Roberto", "Rolando", "Samuel", "Santiago", "Santino", "Santos", "Sebastián", "Thiago", "Tomás", "Valentino", "Vicente", "Víctor"];
		this.docSubscription = this.firebaseauthService.getDocumentById('Puentes', 'bridge-jugadores').subscribe((document: any) =>{
			let bridge = document
			for (let i=0; i<cantidad; i++) {
				let index = Math.floor(Math.random() * arrNombres.length)
				let fakeUser = arrNombres[index]
				let fakeMail = fakeUser + "@gmail.com"
				let fakePass = "asdasdasd"
				this.firebaseauthService.registrar(fakeMail, fakePass)
				.then(res => {
					let isPagado = (Math.random() > 0.7) ? true : false
					let data = {
						nombre: fakeUser,
						pagado: isPagado,
						puntaje: Math.floor(Math.random() * 15 + 20),
						cvotos: Math.floor(Math.random() * 4 + 7),
						stars: [],
						ubicacion: " La Plata ",
						sexo: " No binario ",
						id: ""
					};
					data.id = res.user.uid;	
					bridge.jugadores.push(data.id)
					this.idsFirebaseBots.push(data.id);
					this.firebaseauthService.createDocument(data, this.enlace, res.user.uid);
					this.firebaseauthService.updateBridgeJugadores(bridge);
				})
				.catch(err =>{
					this.cargando = false;
					console.log(err)
				})
			}
			this.docSubscription.unsubscribe();
		})
	}

	llenarConBots(pagado = false) {
		console.log("llenando de bots con voto " + pagado)
		console.log(this.equipoRed.length, this.equipoBlue.length)
		this.equipoBlue[2] = {nombre: "Mariana", pagado: pagado, stars:["full", "full", "full", "null", "null"]};
		this.equipoRed[3] = {nombre: "Riki", pagado: pagado, stars:["full", "full", "half", "null", "null"]};
		this.equipoBlue[3] = {nombre: "Mario", pagado: pagado, stars:["full", "full", "full", "half", "null"]};
		this.equipoRed[4] = {nombre: "Gimena", pagado: pagado, stars:["full", "half", "null", "null", "null"]};
		this.equipoBlue[4] = {nombre: "Andrea", pagado: pagado, stars:["full", "full", "full", "full", "half"]};
		this.equipoRed[0].pagado = true;
		this.equipoBlue[0].pagado = pagado;
		this.equipoRed[1].pagado = pagado;
		this.equipoBlue[1].pagado = pagado;
		this.equipoRed[2].pagado = true;
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

	crearEquipoRedYBlue() {
		let redPlayers: Jugador[] = []
		let bluePlayers: Jugador[] = []
		for (let i=0; i<Math.ceil(Math.random()*9+1); i++) {
			let indexP = Math.floor(Math.random()*40)
			if (i % 2 == 0) redPlayers.push(this.arrJugadores[indexP])
			else bluePlayers.push(this.arrJugadores[indexP])
		}
		return [redPlayers, bluePlayers]
	}

	preloadCanchasLaPlata() {
		let id = 1900;
		let enlace = "CanchasLP";
		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Calle 55 FC',
			direccion: '55 entre 11 y 12',
			lat: -34.9231194,
			lon: -57.951446,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Estadio 7',
			direccion: '6 entre 58 y 59',
			lat: -34.926258,
			lon: -57.963309,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Garra Charrua',
			direccion: '64 entre 7 y 8',
			lat: -34.926258,
			lon: -57.963309,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Camp Nou',
			direccion: '69 entre 12 y 13',
			lat: -34.9332215,
			lon: -57.9522312,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Mega Estadio',
			direccion: 'Av 1 entre 62 y 63',
			lat: -34.9255513,
			lon: -57.9469955,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Complejo Sport',
			direccion: 'Av 1 entre 60 y 61',
			lat: -34.9210431,
			lon: -57.940258,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Complejo 62',
			direccion: '62 entre 1 y 115',
			lat: -34.9210431,
			lon: -57.940258,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Tu Futbol 5',
			direccion: '66 entre 117 y 118',
			lat: -34.9210431,
			lon: -57.940258,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'F5 La Rambla',
			direccion: '74 entre 118 y 119',
			lat: -34.9336092,
			lon: -57.9694005,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Complejo Mash',
			direccion: '45 entre 16 y 17',
			lat: -34.9230396,
			lon: -57.9687499,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Cancha 42',
			direccion: '42 entre 12 y 13',
			lat: -34.9230396,
			lon: -57.9687499,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Siempre al diez',
			direccion: '24 entre 34 y 35',
			lat: -34.9287177,
			lon: -57.9778608,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'La Rambla F5',
			direccion: 'Blvd. 82 entre 36 y 37',
			lat: -34.9263779,
			lon: -57.9878999,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Heroes F5',
			direccion: '60 entre 133 y 134',
			lat: -34.9543973,
			lon: -57.9712958,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Challenger F5',
			direccion: '137 entre 38 y 39',
			lat: -34.9378136,
			lon: -57.9912585,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'El Desafio',
			direccion: 'Av. 32 y 135',
			lat: -34.9414456,
			lon: -58.0063454,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			id: id+1,
			nombre: 'Stadium',
			direccion: '23 entre 70 y 71',
			lat: -34.9506873,
			lon: -57.9561478,
			precio: 1800,
			salas: [],
		}, enlace, String(++id));
	}

	preloadCanchasBerisso() {
		let id = 3900;
		let enlace = 'CanchasBE';
		this.firebaseauthService.createDocument({
			nombre: 'Los Robus',
			direccion: 'Atenas e/ Islas Malvinas y 14',
			lat: -34.8699655,
			lon: -57.8790419,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Spartak',
			direccion: 'Av. Montevideo e/ Edgar Aschieri y Progreso',
			lat: -34.8699655,
			lon: -57.8790419,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Maracana',
			direccion: 'Progreso e/ Av. Montevideo y Ucrania',
			lat: -34.8743378,
			lon: -57.8700375,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Cancha Del Monte',
			direccion: 'Grecia y calle 173',
			lat: -34.8743378,
			lon: -57.8700375,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Tiro Federal',
			direccion: 'Av. del Petroleo Argentino 1455',
			lat: -34.8941002,
			lon: -57.913749,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Canchas de Futbol',
			direccion: '128 entre 60 y 61',
			lat: -34.901619,
			lon: -57.9218867,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Club Santa Teresita',
			direccion: '171 y 45',
			lat: -34.8875259,
			lon: -57.8478191,
		}, enlace, String(++id));
	}
	
	preloadCanchasEnsenada() {
		let id = 5900;
		let enlace = 'CanchasEN';
		this.firebaseauthService.createDocument({
			nombre: 'Club Porteño Ensenada',
			direccion: '899 Herminio Masantonio 851',
			lat: -34.8706441,
			lon: -57.9111863,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Bombonera de Progreso',
			direccion: '300 González Pacheco 252',
			lat: -34.8715366,
			lon: -57.9127813,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Horizonte',
			direccion: 'Saenz Peña 400-352',
			lat: -34.8714038,
			lon: -57.91558,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Polideportivo La Inmaculada',
			direccion: 'Eva Perón entre Av. Horacio Cestino y Alberdi',
			lat: -34.8691935,
			lon: -57.9115421,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'El Estadio',
			direccion: 'San Martin e/ Chile y Bolivia',
			lat: -34.8613055,
			lon: -57.9157214,
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'La Sede',
			direccion: 'Sidotti e/ Chile y Bolivia',
			lat: -34.8556692,
			lon: -57.9133312,
		}, enlace, String(++id));
	}

	preloadFirestorePuentes() {
		let enlace = 'Puentes';
		this.firebaseauthService.createDocument({
			canchasLP: [1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917],
			canchasBE: [3901, 3902, 3903, 3904, 3905, 3906, 3907],
			canchasEN: [5901, 5902, 5903, 5904, 5905, 5906]
		}, enlace, 'bridge-canchas');
	}

	preloadSalas() {
		this.docSubscription = this.firebaseauthService.getDocumentById('Puentes', 'bridge-canchas').subscribe((document: any) =>{
			let puentes = document;
			let puentesLP = document.canchasLP;
			let id = 3;
			puentesLP.forEach(idCancha => {
				this.canchaSubscription = this.firebaseauthService.getDocumentById('CanchasLP', String(idCancha)).subscribe((canchaDocument: any) =>{
					let cancha: Cancha = canchaDocument;

					cancha.salas = [];

					let sexo = ' Mixto ';
					if (Math.random() < 0.5) sexo = ' Masculino '
					else if (Math.random() > 0.75) sexo = ' Femenino ';
					let equipos = this.crearEquipoRedYBlue()
					let sala1: Sala = {
						id: String(++id),
						nombre: cancha.nombre,
						sexo: sexo,
						hora: Math.ceil(Math.random() * 8 + 11) + ":00",
						estado: 'Sala pública',
						slotsTotales: 10,
						equipoRed: equipos[0],
						equipoBlue: equipos[1],
						slotsOcupados: Number(equipos[0].length) + Number(equipos[1].length),
					}

					cancha.salas.push(sala1)

					sexo = ' Mixto ';
					if (Math.random() < 0.5) sexo = ' Masculino '
					else if (Math.random() > 0.75) sexo = ' Femenino ';
					equipos = this.crearEquipoRedYBlue()
					let sala2: Sala = {
						id: String(++id),
						nombre: cancha.nombre,
						sexo: sexo,
						hora: Math.ceil(Math.random() * 8 + 11) + ":00",
						estado: 'Sala pública',
						slotsTotales: 10,
						equipoRed: equipos[0],
						equipoBlue: equipos[1],
						slotsOcupados: Number(equipos[0].length) + Number(equipos[1].length),
					}

					cancha.salas.push(sala2)
					
					this.firebaseauthService.updateCancha('CanchasLP', cancha)
					this.canchaSubscription.unsubscribe();
					if (id > 100) return;
				})
			})
			this.docSubscription.unsubscribe();
		})
	}
}

