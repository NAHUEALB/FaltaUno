import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-buscar',
	templateUrl: './buscar.page.html',
	styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

	iconName: String;
	iconColor: String;

	partidos = [
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Masculino ",
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Mixto "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 5,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Femenino "
		},
		{
			cancha: "Cancha Loca",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "19:00",
			sexo: " Masculino "
		}
	]

	constructor() {
		console.log("Constructor del buscar");
	}

	ngOnInit() {
		this.partidos.forEach(unPartido => this.asignarIcon(unPartido));
	}

	asignarIcon(elem) {
		switch (elem.sexo) {
			case " Masculino ": 
				elem.iconName = "male-outline";
				elem.iconColor = "icon-hombre";
				break;
			case " Femenino ": 
				elem.iconName = "female-outline";
				elem.iconColor = "icon-mujer";
				break;
			case " Mixto ": 
				elem.iconName = "male-female-outline";
				elem.iconColor = "icon-nobin";
				break;
		}
	}

}
