import { Events } from './../../serv/events.service';
import { Jugador } from './../../models/jugador';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Storage } from '@ionic/storage-angular';

import { ToastController } from '@ionic/angular';

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
	public toastController: ToastController,
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

	ngOnInit() {}
	
	irAlPerfil(){
		this.storage.set("jugador", this.jugador)
		.then(() => {
			this.router.navigate([`/perfil`]);
		})
	}

	ionViewWillEnter() {
		this.menuCtrl.enable(true);
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

	ionViewWillLeave(){
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}

	editarJugador() {		
		this.jugador.nombre = this.jugadorForm.value.nombre;
		this.jugador.fnacimiento = this.jugadorForm.value.fnacimiento;
		this.jugador.ubicacion = this.jugadorForm.value.ubicacion;
		this.jugador.sexo = this.jugadorForm.value.sexo;

		let dataSqlJugador = {
			idjugador: this.jugador.id,
			email: this.jugador.email,
			password: this.jugador.password,
			nombre: this.jugador.nombre,
			fnacimiento: this.jugador.fnacimiento,
			sexo: this.jugador.sexo,
			localidad: this.jugador.ubicacion,
			puntaje: this.jugador.puntaje,
			pagado: 0,
			idFirebase: this.jugador.id_firebase,
			cantVotos: this.jugador.cantidad_votos,
		}
		let requestSqlJugador = 'https://backend-f1-java.herokuapp.com/jugadores/actualizar'
		console.log("ENVIANDO ", dataSqlJugador, " A ", requestSqlJugador)
		fetch(requestSqlJugador, {
			method: "PUT", 
			body: JSON.stringify(dataSqlJugador),
			headers: {"Content-type": "application/json; charset=UTF-8"}
		})
		.then(res => res.json())
		.then(() => {
			console.log("EDITADO: ", this.jugador)
			this.presentToast("Tu perfil se actualizó correctamente ✅", 3000);
		})
	}

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}
}
