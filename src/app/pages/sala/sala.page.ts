import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-sala',
	templateUrl: './sala.page.html',
	styleUrls: ['./sala.page.scss'],
})
export class SalaPage implements OnInit {

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

	constructor(private router: Router) { }

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

}
