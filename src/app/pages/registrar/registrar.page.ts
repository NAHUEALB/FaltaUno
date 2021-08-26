import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-registrar',
	templateUrl: './registrar.page.html',
	styleUrls: ['./registrar.page.scss'],
})

export class RegistrarPage implements OnInit {
	jugadorForm: FormGroup;
	newJugador: Jugador;

	localidades = ["La Plata", "Ensenada", "Berisso"];
	sexos = ["No especificado", "Hombre", "Mujer", "No binario"];

	constructor(
		public formBuilder: FormBuilder, 
		private router: Router, 
		public menuCtrl: MenuController, 
		public database: DatabaseService,
		public toastController: ToastController,
		public loadingController: LoadingController) { 
		// this.menuCtrl.enable(false, 'slideMenu');
		this.newJugador = {
			id: '',
			nombre: 'Pepe',
			usuario: "pepito123",
			fnacimiento: "2000-01-01",
			puntaje: 0,
			cvotos: 0,
			sexo: "no binario",
			perfil: false,
			foto: "foto",
			ubicacion: this.localidades[1],
			html: ''
		}

		this.jugadorForm = this.formBuilder.group({
			nombre: '',
			localidad: this.newJugador.ubicacion,
			edad: '',
			sexo: ''
		})
	}

	ngOnInit() {
		console.log("Vista de registrar cargada!");
	}

	async onSubmit(){
		this.presentLoading();
		this.newJugador.nombre = this.jugadorForm.value.nombre;
		let jugadorExtra : NavigationExtras = {
			state: {
				jugador: this.newJugador
			}
		}
		//console.log("vamos a guardar esto: ");
		//console.log(this.newJugador);
		const data = this.newJugador;
		data.id = this.database.createId();
		const link = 'Jugadores';
		await this.database.createDocument<Jugador>(data, link, data.id)
		.then(() => {
			this.presentToast("Perfil creado correctamente", 3000);
			this.router.navigate(['inicio'], jugadorExtra);
		})
		.catch((err) => {
			this.presentToast(err, 3000);
			this.router.navigate(['principal'], jugadorExtra);
		})
			
	}

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}

	async presentLoading() {
		const loading = await this.loadingController.create({
			cssClass: 'my-custom-class',
			message: 'Por favor, espere',
			duration: 2000
		});
		await loading.present();
	
		const { role, data } = await loading.onDidDismiss();
		console.log('Loading dismissed!');
	  }
}
