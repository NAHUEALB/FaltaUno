import { Component, OnInit } from '@angular/core';
import { Partido } from 'src/app/models/partido';
import { Usuario } from 'src/app/models/usuario';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
	usuario: Usuario;
	partido: Partido;
	edad: number;
	valoracion: number;
	stars: Array<string>;

  	constructor() { 
		// lo que deberíamos traer de la db
		let name = "Pepe"; 
		let userName="pepito123";
		let dateStr='1995-02-26'; 
		let totalPunts=22;
		let totalVotes=8; 
		let sexStatus=1;
		let privateProfile=false;
		let picUrl='http://tuvieja.com/perfil.png';
		let geo='La Plata';

      
		this.usuario = {
			nombre: name,
			nomUsuario: userName,
			fnacimiento: dateStr,
			puntajeTotal: totalPunts,
			votosTotal: totalVotes,
			sexo: sexStatus,
			perfil: privateProfile,
			foto: picUrl,
			ubicacion: geo,
		}
		
		this.partido = {
			resultado : "15 - 2",
		}
		
		function getEdad(dateNacimiento) {
			let newDate = new Date(dateNacimiento);
			let actualDate = Date.now();
			let diff = actualDate - newDate.getTime();
			let dateToYears = new Date(diff);
			return dateToYears.getFullYear() - 1970;
		}

		this.edad = getEdad(this.usuario.fnacimiento);

		function fillStars(value) {
			let starsArr = []
			for (let i=0; i<5; i++) {
				if (value - .75 >= i) starsArr.push("full")
				else if (value - .25 >= i) starsArr.push("half")
				else starsArr.push("null");
			}
			return starsArr;
		}
		
		this.valoracion = parseFloat((this.usuario.puntajeTotal / this.usuario.votosTotal).toFixed(2));
		this.stars = fillStars(this.valoracion);
	}


  	ngOnInit() {

  	}

}
