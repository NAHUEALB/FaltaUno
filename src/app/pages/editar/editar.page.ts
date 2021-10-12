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
	jugadorForm: FormGroup;
	jugador: Jugador;
	localidades = ["La Plata", "Ensenada", "Berisso"];
	sexos = ["No binario", "Hombre", "Mujer"];
	docSubscription;
	usuarioSubscription;
	cargando = false;
	enlace = 'Jugador';
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
		this.jugador = {
			id: "",
			nombre: '',
			usuario: "",
			fnacimiento: "",
			puntaje: 0,
			cvotos: 0,
			sexo: "",
			perfil: false,
			foto: "",
			ubicacion: this.localidades[0],
			html: ''
		}

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
		this.cargando = true;
		
		this.jugador.nombre = this.jugadorForm.value.nombre;
		this.jugador.fnacimiento = this.jugadorForm.value.fnacimiento;
		this.jugador.ubicacion = this.jugadorForm.value.ubicacion;
		this.jugador.sexo = this.jugadorForm.value.sexo;
		
		this.firebaseauthService.updateDocument(this.enlace, this.jugador).then(res => {
			// this.events.publish("actualizar:storage", false);
			this.storage.set("jugador", this.jugador).then(()=>{
				this.router.navigate(["/perfil"]);
			})
		});

		// const juga2 = this.storage.get("jugador")
		// .then(res => {
		// 	console.log(res);
		// 	console.log("id: " + res.id);
		// })

		

		/*this.database.firestore()
		.collection('Jugador')
		.doc("L52TbHMvBueg0EutDGHYJzIVba12")
		.update({
			nombre: this.jugador.nombre,
			fnacimiento: this.jugador.fnacimiento,
			ubicacion: this.jugador.ubicacion,
			sexo: this.jugador.sexo,
		}).then(() => { console.log("funcionó eaea") });
		console.log("funcionó?")*/
		/*.update({
			nombre: this.jugador.nombre,
			fnacimiento: this.jugador.fnacimiento,
			ubicacion: this.jugador.ubicacion,
			sexo: this.jugador.sexo,
		}).then(() => {
			this.storage.set("jugador", document).then(() => {
				this.router.navigate(['/perfil']);
			})
		}).catch(() => {
			console.log("Error modificando la base de datos de firebase")
		})*/
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
