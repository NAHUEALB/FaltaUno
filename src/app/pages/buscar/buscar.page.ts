import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
			hora: "12:00",
			sexo: " Masculino ",
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "12:00",
			sexo: " Mixto "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "13:00",
			sexo: " Femenino "
		},
		{
			cancha: "Cancha Loca",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "13:00",
			sexo: " Masculino "
		},
		{
			cancha: "Cancha La Lora",
			direccion: "Calle 44 y 5",
			slotsOcupados: 6,
			slotsTotales: 10,
			hora: "13:00",
			sexo: " Masculino "
		},
		{
			cancha: "Cancha La Lora",
			direccion: "Calle 44 y 5",
			slotsOcupados: 5,
			slotsTotales: 10,
			hora: "14:00",
			sexo: " Femenino "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "14:00",
			sexo: " Mixto "
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 8,
			slotsTotales: 10,
			hora: "14:00",
			sexo: " Masculino "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "15:00",
			sexo: " Mixto "
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "15:00",
			sexo: " Mixto "
		},
		{
			cancha: "Cancha Loca",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "15:00",
			sexo: " Masculino "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Masculino "
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Mixto "
		},
		{
			cancha: "Cancha Loca",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Mixto "
		},
		{
			cancha: "Megastadio",
			direccion: "Calle 1 y 64",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Mixto "
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Femenino "
		},
		{
			cancha: "Cancha La Lora",
			direccion: "Calle 44 y 5",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "18:00",
			sexo: " Femenino "
		},
	];

	distancias = {
		"Megastadio" : 3,
		"Estadio 7" : 2,
		"Cancha La Lora" : 6,
		"Cancha Loca" : 5
	}

	constructor(private router: Router) {
	}

	ngOnInit() {
		this.partidos.forEach(unPartido => {
			this.setSexo(unPartido)
			this.setColorSlot(unPartido)
			this.setOrden(unPartido)
		});
		this.ordenarPartidos(this.partidos);
	}

	irAlInicio() {
		this.router.navigate([`/inicio`]);
	}

	setSexo(elem) {
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
	
	setColorSlot(elem) {
		elem.optionFlama = "";
		if (elem.slotsOcupados < 5) {
			elem.slotColor = "slot-disponible";
		} else if (elem.slotsOcupados < 8) {
			elem.slotColor = "slot-popular";
		} else {
			elem.optionFlama = "flama";
			elem.slotColor = "slot-ocupado";
		}
	}

	setOrden(elem) {
		let now = new Date();
		let horaNow = now.getHours();
		let horaPartido = elem.hora.split(":")[0] - 0;

		let tiempo = Math.max(0, Math.floor(horaPartido - horaNow));
		let slots = Math.floor(10 - elem.slotsOcupados);
		let distancia = Math.floor(this.distancias[elem.cancha]*(4/3));

		elem.orden = tiempo + slots + distancia;

		console.log(elem.cancha+", "+elem.hora+"hs, "+elem.slotsOcupados+"/10, "+this.distancias[elem.cancha]+"km: "
		+tiempo+"+"+slots+"+"+distancia+" = "+elem.orden);
	}

	ordenarPartidos(partidos) {
		partidos.sort(function(a, b){
			return a.orden-b.orden
		});
	}

	swapAMapa() {
		document.getElementById("perfil-icon-a-mapa").style.display = "none";
		document.getElementById("perfil-icon-a-lista").style.display = "block";
		document.getElementById("blk-lista").style.display = "none";
		document.getElementById("blk-mapa").style.display = "block";
	}

	swapALista() {
		document.getElementById("perfil-icon-a-mapa").style.display = "block";
		document.getElementById("perfil-icon-a-lista").style.display = "none";
		document.getElementById("blk-lista").style.display = "block";
		document.getElementById("blk-mapa").style.display = "none";
	}

}
