import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Jugador } from 'src/app/models/jugador';

@Component({
	selector: 'app-sala',
	templateUrl: './sala.page.html',
	styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

	enlace = 'Jugador';
	docSubscription;
	usuarioSubscription;
	cargando = false;
	canchaNombre = "HARDCODED_CANCHA";
	canchaDireccion = "HC DIRE 123";
	canchaHora = "12:34";
	canchaPrecio = "$199";
	
	jugadorVacio = {
		nombre: " (vacío) ",
		puntaje: 0,
		cvotos: 0,
		pagado: false,
		stars: []
	}
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
		this.jugadorVacio,
		this.jugadorVacio,
	];
	equipoBlue = [
		{
		nombre: "Johana de los ángeles crec",
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
		this.jugadorVacio,
		this.jugadorVacio,
	];
	stars: any[];

	constructor(
		private router: Router,
		public firebaseauthService: FirebaseauthService
	) {}

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

	irAlEditarSala() {
		this.router.navigate([`/editar-sala`]);
	}
	mezclarEquipos(arr1, arr2) {
		console.log(arr1, arr2)
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
		for (let i = 0; i <= 10 - arrAux.length + 2; i++) arrAux.push(this.jugadorVacio)
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
		console.log(arrAux)
		return arrAux
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
		let id = String(Math.ceil(Math.random() * 99999 + 1))
		this.firebaseauthService.createDocument(data, 'Salas', id);
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
}
