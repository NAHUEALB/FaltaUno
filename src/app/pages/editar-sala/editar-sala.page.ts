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
	sala: Sala;
	sexos = ["No binario", "Hombre", "Mujer"];
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
		this.sala = {
      		id: '',
			nombre: '',
			sexo: "",
			estado: '',
			slotsOcupados: 0,
			slotsTotales: 0,
			hora: '',
			equipoRed: [],
			equipoBlue: []
		}

		this.salaForm = this.formBuilder.group({
			nombre: '',
			sexo: '',
      		estado: '',
		});
	}

	ngOnInit() {
		this.storage.get("sala").then(res => {
			console.log(res)
			this.sala = res;
			this.salaForm.patchValue({
				nombre: this.sala.nombre,
				sexo: this.sala.sexo,
				estado: this.sala.estado
			})
		})
	}

	onSubmit(){
	}

	editarSala() {
		this.cargando = true;
		
		this.sala.nombre = this.salaForm.value.nombre;
		this.sala.sexo = this.salaForm.value.sexo;
    	this.sala.estado = this.salaForm.value.estado;
		
		this.firebaseauthService.updateSala(this.enlace, this.sala).then(res => {
			// this.events.publish("actualizar:storage", false);
			this.storage.set("sala", this.sala).then(()=>{
				this.router.navigate(["/sala"]);
			})
		});
	}

	irALaSala(){
		this.router.navigate([`/sala`]);
	}

	ionViewWillEnter() {
		this.menuCtrl.enable(true);
	}

	ionViewWillLeave(){
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
}
