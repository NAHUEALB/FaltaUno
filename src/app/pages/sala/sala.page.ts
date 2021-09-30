import { Component, OnInit } from '@angular/core';

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
	equipoRed = [
		{
		nombre: "Juan",
		puntaje: 15,
		cvotos: 4,
		stars: []
		},
		{
		nombre: "Pedro",
		puntaje: 21,
		cvotos: 7,
		stars: []
		},
		{
		nombre: "Jesus",
		puntaje: 18,
		cvotos: 8,
		stars: []
		},
		{
		nombre: "Esperando...",
		puntaje: 0,
		cvotos: 0,
		stars: []
		},
		{
		nombre: "Esperando...",
		puntaje: 0,
		cvotos: 0,
		stars: []
		},
	];
	equipoBlue = [
		{
		nombre: "Johana",
		puntaje: 30,
		cvotos: 8,
		stars: []
		},
		{
		nombre: "Paula",
		puntaje: 22,
		cvotos: 5,
		stars: []
		},
		{
		nombre: "Marcos",
		puntaje: 11,
		cvotos: 5,
		stars: []
		},
		{
		nombre: "Esperando...",
		puntaje: 0,
		cvotos: 0,
		stars: []
		},
		{
		nombre: "Esperando...",
		puntaje: 0,
		cvotos: 0,
		stars: []
		},
	];
	stars: any[];

	constructor() { }

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

}
