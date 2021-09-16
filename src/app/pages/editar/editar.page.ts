import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Jugador } from 'src/app/models/jugador';

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

	constructor(
	public menuCtrl: MenuController, 
	private router: Router,
	public formBuilder: FormBuilder,
	public database: DatabaseService,
	private storage: Storage,
	public firebaseauthService: FirebaseauthService,
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

		this.storage.get("jugador").then(res => {
			this.jugador = res;

			let indexSexo = 0; 
			if (this.jugador.sexo == "Hombre") indexSexo = 1
			else if (this.jugador.sexo == "Mujer") indexSexo = 2;

			let indexCiudad = 0; 
			if (this.jugador.ubicacion == "Ensenada") indexCiudad = 1
			else if (this.jugador.ubicacion == "Berisso") indexCiudad = 2;

			this.jugadorForm = this.formBuilder.group({
				nombre: this.jugador.nombre,
				fnacimiento: this.jugador.fnacimiento,
				ubicacion: '',
				sexo: ''
			});
		})

	}

	ngOnInit() {
		//this.menuCtrl.enable(true);
	}

	radioChange(value){
		console.log(value.detail.value);
	}

	onSubmit(){
		//Esto deberiamos mandarlo a la bd.
		//En el perfil deberiamos poner que cada vez que se entre, se recargue la informacion de ese jugador
		//Como saber que jugador es? proponer el uso del DNI.
		console.log(this.jugadorForm.value);
	}

	editarJugador() {
		console.log("--- JUGADOR EN storage (editar)");
		// const juga2 = this.storage.get("jugador")
		// .then(res => {
		// 	console.log(res);
		// 	console.log("id: " + res.id);
		// })

		this.router.navigate(["/perfil"]);

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

	ionViewWillEnter() {
		this.menuCtrl.enable(true);
	}

	ionViewWillLeave(){
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
}
