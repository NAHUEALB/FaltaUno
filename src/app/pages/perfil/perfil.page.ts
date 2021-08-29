import { Prueba } from './../../models/interfaces';
import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Partido } from 'src/app/models/partido';
import { Usuario } from 'src/app/models/usuario';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
	enlace = 'prueba/'
	usuario: Usuario;
	partido: Partido;
	edad: number;
	valoracion: number;
	stars = [];
	pruebaUsuario: Prueba;

  	constructor( private router: Router, 
				public firebaseauthService: FirebaseauthService) { 
		this.firebaseauthService.getUserCurrent().subscribe(res =>{
			this.firebaseauthService.getDocumentById(this.enlace,res.uid).subscribe((document: any) =>{
				this.pruebaUsuario = document;
				console.log(this.pruebaUsuario);
				this.usuario.nombre = this.pruebaUsuario.nombre;
			})

		}) ;



		// lo que deberíamos traer de la db
		let name = "Pepe"; 
		let userName="pepito123";
		let dateStr='1995-02-26'; 
		let totalPunts=22;
		let totalVotes=8; 
		let sex='Masculino';
		let privateProfile=false;
		let picUrl='http://tuvieja.com/perfil.png';
		let geo='La Plata';
      
		this.usuario = {
			id:"1",
			nombre: '',
			nomUsuario: userName,
			fnacimiento: dateStr,
			puntajeTotal: totalPunts,
			votosTotal: totalVotes,
			sexo: sex,
			perfil: privateProfile,
			foto: picUrl,
			ubicacion: geo,
		}
		
		this.partido = {
			resultado : "15 - 2",
			fecha: "10-2-2020",
			valoracion:12
		}
		this.edad = this.getEdad(this.usuario.fnacimiento);	
		this.valoracion = parseFloat((this.usuario.puntajeTotal / this.usuario.votosTotal).toFixed(2));
		this.fillStars(this.valoracion);
	}


  	ngOnInit() {

  	}

	getEdad(dateNacimiento) {
		let newDate = new Date(dateNacimiento);
		let actualDate = Date.now();
		let diff = actualDate - newDate.getTime();
		let dateToYears = new Date(diff);
		return dateToYears.getFullYear() - 1970;
	}

	
	fillStars(value) {
		for (let i=0; i<5; i++) {
			if (value - .75 >= i) this.stars.push("full")
			else if (value - .25 >= i) this.stars.push("half")
			else this.stars.push("null");
		}
		
	}

	openTab(tab: String){
		let usuarioExtra : NavigationExtras = {
			state: {
				usuario: this.usuario
			}
		}
		this.router.navigate(['perfil/'+tab], usuarioExtra);
	}

}
