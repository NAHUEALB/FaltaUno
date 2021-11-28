import { Events } from './../../serv/events.service';
import { Jugador } from './../../models/jugador';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Storage } from '@ionic/storage-angular';

import { FirebaseauthService } from 'src/app/serv/firebaseauth.service';
import { DatabaseService } from 'src/app/serv/database.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})

export class EditarPage implements OnInit {
	docSubscription;
	usuarioSubscription;

	jugadorForm: FormGroup;
	enlace = 'Jugador';
	jugador = {
		id: '',
		id_firebase: '',
		nombre: '',
		password: '',
		email: '',
		fnacimiento: '',
		puntaje: 0,
		cantidad_votos: 0,
		sexo: "",
		perfil: false,
		ubicacion: ' La Plata ',
	};
	localidades = ["La Plata"/*, "Ensenada", "Berisso"*/];
	sexos = ["No binario", "Hombre", "Mujer"];
	
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
		this.jugadorForm = this.formBuilder.group({
			nombre: '',
			fnacimiento: '',
			ubicacion: '',
			sexo: ''
		});


	}

	ngOnInit() {
		this.storage.get("jugador").then(res => {
			this.jugador = res;
			this.jugadorForm.patchValue({
				nombre: this.jugador.nombre,
				fnacimiento: this.jugador.fnacimiento,
				ubicacion: this.jugador.ubicacion,
				sexo: this.jugador.sexo
			})
		})
	}

	editarJugador() {		
		this.jugador.nombre = this.jugadorForm.value.nombre;
		this.jugador.fnacimiento = this.jugadorForm.value.fnacimiento;
		this.jugador.ubicacion = this.jugadorForm.value.ubicacion;
		this.jugador.sexo = this.jugadorForm.value.sexo;
		
		/* this.firebaseauthService.updateDocument(this.enlace, this.jugador).then(res => {
			// this.events.publish("actualizar:storage", false);
			this.storage.set("jugador", this.jugador).then(()=>{
				this.router.navigate(["/perfil"]);
			})
		}); */
	}

	irAlPerfil(){
		this.router.navigate([`/perfil`]);
	}

	ionViewWillEnter() {
		this.menuCtrl.enable(true);
	}

	ionViewWillLeave(){
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
}
