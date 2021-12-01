import { Component, OnInit } from '@angular/core';

import { Events } from './../../serv/events.service';
import { Sala } from './../../models/sala';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Storage } from '@ionic/storage-angular';

import { FirebaseauthService } from 'src/app/serv/firebaseauth.service';
import { DatabaseService } from 'src/app/serv/database.service';

@Component({
	selector: 'app-editar-sala',
	templateUrl: './editar-sala.page.html',
	styleUrls: ['./editar-sala.page.scss'],
})
export class EditarSalaPage implements OnInit {
  	salaForm: FormGroup;
	partido
	sexos = ["Mixto", "Masculino", "Femenino"];
  	estados = ["Sala pública", "Sala privada"]
	docSubscription;
	usuarioSubscription;
	cargando = false;
	enlace = 'Salas';
	ACTUALIZAR_STORAGE = "actualizar:storage";

	constructor(
	public menuCtrl: MenuController, 
	private router: Router,
	public formBuilder: FormBuilder,
	public database: DatabaseService,
	private storage: Storage,
	public firebaseauthService: FirebaseauthService,
	private events: Events
	){ 
		this.salaForm = this.formBuilder.group({
			nombre: '',
			/* sexo: '',
      		estado: '', */
		});
	}

	ngOnInit() {}

	ionViewWillEnter() {
		this.menuCtrl.enable(true);
		this.storage.get("partido").then(partido => {
			this.partido = partido;
			/* this.partido.estado = this.estados[0]
			this.partido.sexo.trim() */
			console.log(this.partido, this.partido.sala)
			this.salaForm.patchValue({
				nombre: this.partido.sala,
				/* sexo: this.partido.sexo,
				estado: this.partido.estado */
			})
		})
	}
	
	ionViewWillLeave(){
		this.cargando = false;
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}

	irALaSala(){
		this.router.navigate([`/sala`]);
	}
	
	onSubmit(){
	}

	async editarSala() {
		this.cargando = true;
		let idPartido = (await this.storage.get("partido")).idpartido
		this.partido = await this.descargarPartido(idPartido)
		this.partido.sala = this.salaForm.value.nombre;/* 
		this.partido.sexo = this.salaForm.value.sexo;
    	this.partido.estado = this.salaForm.value.estado; */
		
		//await this.firebaseauthService.updateSala(this.enlace, this.partido)
		await this.storage.set("partido", this.partido)
		this.actualizarPartido(this.partido)
			.then(() => this.router.navigate(["/sala"]))
			.catch(err => console.error(err))
	}

	async actualizarPartido(partidoActualizado) {
		let path = '/partidos/actualizar'
		let requestSqlPartido = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cEDITANDO DATOS DEL PARTIDO [" + this.partido.idpartido + "]",
			"color:brown; background-color: pink; font-size: 16px; font-weight: bold;"
		)
		console.log(partidoActualizado)
		return await (await fetch(requestSqlPartido, {
			method: "PUT", 
			body: JSON.stringify(partidoActualizado),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})).json()
	}

	async descargarPartido(idPartido) {
		let path = '/partidos/' + idPartido
		let partidoSql = 'https://backend-f1-java.herokuapp.com' + path
		console.log(
			"%cDESCARGAR PARTIDO ACTUALIZADO [" + idPartido + "] -----> " + path,
			"color:green; background-color: lime; font-size: 16px; font-weight: bold;"
		)
		return await (await fetch(partidoSql)).json()
	}
}
