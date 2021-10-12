import { Component, OnInit } from '@angular/core';

import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Jugador } from 'src/app/models/jugador';
import { Cancha } from 'src/app/models/cancha';

@Component({
	selector: 'app-sala',
	templateUrl: './sala.page.html',
	styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

	enlace = 'Jugador';
	enlaceCanchasLP = 'CanchasLP';
	docSubscription;
	usuarioSubscription;
	cargando = false;
	canchaNombre = "HARDCODED_CANCHA";
	canchaDireccion = "HC DIRE 123";
	canchaHora = "12:34";
	canchaPrecio = "$199";
	equipoRed = [
		{
		nombre: "Juan",
		puntaje: 15,
		cvotos: 4,
		pagado: true,
		stars: []
		},
		{
		nombre: "Pedro",
		puntaje: 21,
		cvotos: 7,
		pagado: false,
		stars: []
		},
		{
		nombre: "Jesus de nazaret del señor",
		puntaje: 18,
		cvotos: 8,
		pagado: false,
		stars: []
		},
		{
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
		},
		{
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
		},
	];
	equipoBlue = [
		{
		nombre: "Johana de los ángeles crecidos del monte",
		puntaje: 30,
		cvotos: 8,
		pagado: false,
		stars: []
		},
		{
		nombre: "Paula",
		puntaje: 22,
		cvotos: 5,
		pagado: true,
		stars: []
		},
		{
		nombre: "Marcos",
		puntaje: 11,
		cvotos: 5,
		pagado: false,
		stars: []
		},
		{
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
		},
		{
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
		},
	];
	stars: any[];

	constructor(public firebaseauthService: FirebaseauthService) {}

	ngOnInit() {}

	ionViewWillEnter() {
		this.equipoRed.concat(this.equipoBlue).forEach(p => {
			let valoracion = this.getValoracion(p.puntaje, p.cvotos);
			this.fillStars(p, valoracion);
		});
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

	crearSalaNueva() {
		var arrNombresCanchas = ["Megastadio", "Cancha La Lora", "Estadio 7", "SportCenter", "Camp Nou", "Bernabeu", "Old Trafford", "Canchgym"]
		let randSexo = ' Mixto '
		if (Math.random() > 0.8) randSexo = ' Femenino '
		else if (Math.random() < 0.5) randSexo = ' Masculino '
		let data = {
			nombre: arrNombresCanchas[Math.floor(Math.random() * arrNombresCanchas.length + 1)],
			hora: Math.floor(Math.random() * 10 + 12) + ":00",
			sexo: randSexo,
			lat: 0,
			lon: 0,
			equipoRed: [],
			equipoBlue: [],
		}
	}

	crearFirebaseBot() {
		var arrNombres = ["Adrián", "Agustín", "Alberto", "Alejandro", "Alexander", "Alexis", "Alonso", "Andrés Felipe", "Ángel", "Anthony", "Antonio", "Bautista", "Benicio", "Benjamín", "Carlos", "Carlos Alberto", "Carlos Eduardo", "Carlos Roberto", "César", "Cristóbal", "Daniel", "David", "Diego", "Dylan", "Eduardo", "Emiliano", "Emmanuel", "Enrique", "Erik", "Ernesto", "Ethan", "Fabián", "Facundo", "Felipe", "Félix", "Félix María", "Fernando", "Francisco", "Francisco Javier", "Gabriel", "Gaspar", "Gustavo Adolfo", "Hugo", "Ian", "Iker", "Isaac", "Jacob", "Javier", "Jayden", "Jeremy", "Jerónimo", "Jesús", "Jesús Antonio", "Jesús Víctor", "Joaquín", "Jorge", "Jorge  Alberto", "Jorge Luis", "José", "José Antonio", "José Daniel", "José David", "José Francisco", "José Gregorio", "José Luis", "José Manuel", "José Pablo", "Josué", "Juan", "Juan Ángel", "Juan Carlos", "Juan David", "Juan Esteban", "Juan Ignacio", "Juan José", "Juan Manuel", "Juan Pablo", "Juan Sebastián", "Julio", "Julio Cesar", "Justin", "Kevin", "Lautaro", "Liam", "Lian", "Lorenzo", "Lucas", "Luis", "Luis Alberto", "Luis Emilio", "Luis Fernando", "Manuel", "Manuel Antonio", "Marco Antonio", "Mario", "Martín", "Mateo", "Matías", "Maximiliano", "Maykel", "Miguel", "Miguel  ngel", "Nelson", "Noah", "Oscar", "Pablo", "Pedro", "Rafael", "Ramón", "Raúl", "Ricardo", "Rigoberto", "Roberto", "Rolando", "Samuel", "Samuel David", "Santiago", "Santino", "Santos", "Sebastián", "Thiago", "Thiago Benjamín", "Tomás", "Valentino", "Vicente", "Víctor", "Víctor Hugo"];
		let fakeUser = arrNombres[Math.floor(Math.random() * arrNombres.length + 1)].split(" ")[0]
		let fakeMail = fakeUser + "@gmail.com"
		let fakePass = "asdasdasd"
		this.firebaseauthService.registrar(fakeMail, fakePass)
		.then(res => {
			let isPagado = (Math.random() > 0.7) ? true : false
			let data = {
				nombre: fakeUser,
				pagado: isPagado,
				puntaje: Math.random() * 15 + 20,
				cvotos: Math.random() * 4 + 7,
				stars: [],
				id: ""
			};
			data.id = res.user.uid;	
			this.firebaseauthService.createDocument(data, this.enlace, res.user.uid);
		})
		.catch(err =>{
			this.cargando = false;
			console.log(err)
		})
	}

	preloadCanchasLaPlata() {
		let id = 1900;
		let enlace = "CanchasLP";
		this.firebaseauthService.createDocument({
			nombre: 'Calle 55 FC',
			direccion: '55 entre 11 y 12',
			lat: -34.9231194,
			lon: -57.951446,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Estadio 7',
			direccion: '6 entre 58 y 59',
			lat: -34.926258,
			lon: -57.963309,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Garra Charrua',
			direccion: '64 entre 7 y 8',
			lat: -34.926258,
			lon: -57.963309,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Camp Nou',
			direccion: '69 entre 12 y 13',
			lat: -34.9332215,
			lon: -57.9522312,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Mega Estadio',
			direccion: 'Av 1 entre 62 y 63',
			lat: -34.9255513,
			lon: -57.9469955,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Complejo Sport',
			direccion: 'Av 1 entre 60 y 61',
			lat: -34.9210431,
			lon: -57.940258,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Complejo 62',
			direccion: '62 entre 1 y 115',
			lat: -34.9210431,
			lon: -57.940258,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Tu Futbol 5',
			direccion: '66 entre 117 y 118',
			lat: -34.9210431,
			lon: -57.940258,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'F5 La Rambla',
			direccion: '74 entre 118 y 119',
			lat: -34.9336092,
			lon: -57.9694005,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Complejo Mash',
			direccion: '45 entre 16 y 17',
			lat: -34.9230396,
			lon: -57.9687499,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Cancha 42',
			direccion: '42 entre 12 y 13',
			lat: -34.9230396,
			lon: -57.9687499,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Siempre al diez',
			direccion: '24 entre 34 y 35',
			lat: -34.9287177,
			lon: -57.9778608,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'La Rambla F5',
			direccion: 'Blvd. 82 entre 36 y 37',
			lat: -34.9263779,
			lon: -57.9878999,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Heroes F5',
			direccion: '60 entre 133 y 134',
			lat: -34.9543973,
			lon: -57.9712958,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Challenger F5',
			direccion: '137 entre 38 y 39',
			lat: -34.9378136,
			lon: -57.9912585,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'El Desafio',
			direccion: 'Av. 32 y 135',
			lat: -34.9414456,
			lon: -58.0063454,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Stadium',
			direccion: '23 entre 70 y 71',
			lat: -34.9506873,
			lon: -57.9561478,
			equipoRed: [], equipoBlue: []
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
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Spartak',
			direccion: 'Av. Montevideo e/ Edgar Aschieri y Progreso',
			lat: -34.8699655,
			lon: -57.8790419,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Maracana',
			direccion: 'Progreso e/ Av. Montevideo y Ucrania',
			lat: -34.8743378,
			lon: -57.8700375,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Cancha Del Monte',
			direccion: 'Grecia y calle 173',
			lat: -34.8743378,
			lon: -57.8700375,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Tiro Federal',
			direccion: 'Av. del Petroleo Argentino 1455',
			lat: -34.8941002,
			lon: -57.913749,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Canchas de Futbol',
			direccion: '128 entre 60 y 61',
			lat: -34.901619,
			lon: -57.9218867,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Club Santa Teresita',
			direccion: '171 y 45',
			lat: -34.8875259,
			lon: -57.8478191,
			equipoRed: [], equipoBlue: []
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
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Bombonera de Progreso',
			direccion: '300 González Pacheco 252',
			lat: -34.8715366,
			lon: -57.9127813,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Horizonte',
			direccion: 'Saenz Peña 400-352',
			lat: -34.8714038,
			lon: -57.91558,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'Polideportivo La Inmaculada',
			direccion: 'Eva Perón entre Av. Horacio Cestino y Alberdi',
			lat: -34.8691935,
			lon: -57.9115421,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'El Estadio',
			direccion: 'San Martin e/ Chile y Bolivia',
			lat: -34.8613055,
			lon: -57.9157214,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));

		this.firebaseauthService.createDocument({
			nombre: 'La Sede',
			direccion: 'Sidotti e/ Chile y Bolivia',
			lat: -34.8556692,
			lon: -57.9133312,
			equipoRed: [], equipoBlue: []
		}, enlace, String(++id));
	}
}

