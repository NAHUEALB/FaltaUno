import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

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
			cancha: "Los Robus",
			direccion: "Calle 1 y 64",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "12:00",
			sexo: " Masculino ",
			latitud: -34.8699655,
			longitud: -57.8790419
		},
		{
			cancha: "Maracaná",
			direccion: "Calle 6 y 59",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "12:00",
			sexo: " Mixto ",
			latitud: -34.8743378,
			longitud: -57.8700375

		},
		{
			cancha: "Cancha Del Monte",
			direccion: "Calle 1 y 64",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "13:00",
			sexo: " Femenino ",
			latitud: -34.8743378 ,
			longitud: -57.8700375
		},
		{
			cancha: "Fútbol 5 tiro Federal",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "13:00",
			sexo: " Masculino ",
			latitud: -34.8941002,
			longitud: -57.913749
		},
		{
			cancha: "Canchas de Fútbol",
			direccion: "Calle 44 y 5",
			slotsOcupados: 6,
			slotsTotales: 10,
			hora: "13:00",
			sexo: " Masculino ",
			latitud: -34.901619,
			longitud: -57.9218867
		},
		{
			cancha: "Club Santa Teresita",
			direccion: "Calle 44 y 5",
			slotsOcupados: 5,
			slotsTotales: 10,
			hora: "14:00",
			sexo: " Femenino ",
			latitud: -34.8875259,
			longitud:-57.8478191
		},
		{
			cancha: "Calle 55 F.C",
			direccion: "Calle 1 y 64",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "14:00",
			sexo: " Mixto ",
			latitud: -34.9231194,
			longitud: -57.951446
		},
		{
			cancha: "Estadio 7",
			direccion: "Calle 6 y 59",
			slotsOcupados: 8,
			slotsTotales: 10,
			hora: "14:00",
			sexo: " Masculino ",
			latitud: -34.926258,
			longitud: -57.963309
		},
		{
			cancha: "Garra Charrua",
			direccion: "Calle 1 y 64",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "15:00",
			sexo: " Mixto ",
			latitud: -34.926258,
			longitud: -57.963309
		},
		{
			cancha: "Camp Nou",
			direccion: "Calle 6 y 59",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "15:00",
			sexo: " Mixto ",
			latitud: -34.9332215,
			longitud: -57.9522312
		},
		{
			cancha: "Mega Estadio",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "15:00",
			sexo: " Masculino ",
			latitud: -34.9255513,
			longitud:-57.9469955
		},
		{
			cancha: "Complejo Sport",
			direccion: "Calle 1 y 64",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Masculino ",
			latitud: -34.9210431,
			longitud: -57.940258
		},
		{
			cancha: "Complejo 62 Fútbol 5",
			direccion: "Calle 6 y 59",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Mixto ",
			latitud: -34.9210431,
			longitud: -57.940258
		},
		{
			cancha: "Ttu Fútbol 5",
			direccion: "Calle 22 y Palermo",
			slotsOcupados: 7,
			slotsTotales: 10,
			hora: "16:00",
			sexo: " Mixto ",
			latitud: -34.9210431,
			longitud: -57.940258
		},
		{
			cancha: "Fútbol 5 La Rambla",
			direccion: "Calle 1 y 64",
			slotsOcupados: 3,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Mixto ",
			latitud: -34.9336092,
			longitud: -57.9694005
		},
		{
			cancha: "Complejo Mash Fútbol 5",
			direccion: "Calle 6 y 59",
			slotsOcupados: 2,
			slotsTotales: 10,
			hora: "17:00",
			sexo: " Femenino ",
			latitud: -34.9230396,
			longitud: -57.9687499
		},
		{
			cancha: "Cancha 42 - Fútbol 5",
			direccion: "Calle 44 y 5",
			slotsOcupados: 9,
			slotsTotales: 10,
			hora: "18:00",
			sexo: " Femenino ",
			latitud: -34.9230396,
			longitud: -57.9687499
		}
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

		//console.log(elem.cancha+", "+elem.hora+"hs, "+elem.slotsOcupados+"/10, "+this.distancias[elem.cancha]+"km: "+tiempo+"+"+slots+"+"+distancia+" = "+elem.orden);
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

	mostrarMapa(partidoSeleccionado){
		let canchaExtra : NavigationExtras = {
			state: {
				cancha: partidoSeleccionado
			}
		}
		this.router.navigate(['mapa'], canchaExtra);
	}


	irALaSala(){
		this.router.navigate(['sala']);
	}

}
