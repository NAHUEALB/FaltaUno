import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';
import { Prueba } from 'src/app/models/interfaces';

@Component({
	selector: 'app-registrar',
	templateUrl: './registrar.page.html',
	styleUrls: ['./registrar.page.scss'],
})

export class RegistrarPage implements OnInit {
	enlace = 'prueba';
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
		public loadingController: LoadingController,
		public firebaseauthService: FirebaseauthService) { 
		// this.menuCtrl.enable(false);
		this.newJugador = {
			id: '',
			nombre: '',
			usuario: "pepito123",
			fnacimiento: "2000-01-01",
			puntaje: 0,
			cvotos: 0,
			sexo: "no binario",
			perfil: false,
			foto: "foto",
			ubicacion: this.localidades[1],
			html: '',
			password: ''
		}

		this.jugadorForm = this.formBuilder.group({
			nombre: '',
			usuario: '',
			contraseña:new FormControl('', Validators.minLength(7)),
			edad:'',
			localidad:'',
			sexo:''
		})
	}

	ngOnInit() {
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




	  crearUsuario(){
			console.log(this.jugadorForm);
			const boton = document.getElementById("boton-submit");
			boton.innerHTML = "Cargando..."
			this.firebaseauthService.registrar(this.jugadorForm.value.usuario,this.jugadorForm.value.contraseña)
			.then(res => {
				let data = this.cargarJugador();			
				this.firebaseauthService.createDocument<Prueba>(data, this.enlace, res.user.uid)
				this.router.navigate(["/inicio"]);
			})
			.catch(err =>{
				this.presentToast(err,3000)
				console.log("error"+ err);
			})
	  }


	  cargarJugador(){
		  let data: Prueba;
		  data={
			edad: this.jugadorForm.value.edad,
			localidad : this.jugadorForm.value.localidad,
			nombre : this.jugadorForm.value.nombre,
		  	sexo : this.jugadorForm.value.sexo
		  }
		  return data;
	  }
}
