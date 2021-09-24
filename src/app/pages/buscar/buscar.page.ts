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
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Femenino "
		},
		{
			cancha: "Cancha Loca",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "19:00",
			sexo: " Masculino "
		},


		{
			cancha: "Cancha La Lora",
			direccion: "Calle 44 y 5",
			slotsOcupados: 6,
			slotsTotales: 10,
			hora: "19:00",
			sexo: " Masculino "
		},
		{
			cancha: "Cancha La Lora",
			direccion: "Calle 44 y 5",
			slotsOcupados: 5,
			slotsTotales: 10,
			hora: "20:00",
			sexo: " Femenino "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "20:00",
			sexo: " Mixto "
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 8,
			slotsTotales: 10,
			hora: "21:00",
			sexo: " Masculino "
		}
	]

	constructor() {
		console.log("Constructor del buscar");
	}

	ngOnInit() {
		this.partidos.forEach(unPartido => {
			this.asignarSexo(unPartido)
			this.asignarColorSlot(unPartido)
		});
	}

	asignarSexo(elem) {
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
	
	asignarColorSlot(elem) {
		if (elem.slotsOcupados < 5) {
			elem.slotColor = "slot-disponible";
		} else if (elem.slotsOcupados < 9) {
			elem.slotColor = "slot-popular";
		} else {
			elem.slotColor = "slot-ocupado";
		}
	}

}
