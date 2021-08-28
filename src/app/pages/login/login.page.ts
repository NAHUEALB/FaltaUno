import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	jugadorForm: FormGroup;
	newJugador: Jugador;
	localidades = ["La Plata", "Ensenada", "Berisso"];

	constructor(
		public formBuilder: FormBuilder, 
		private router: Router, 
		public menuCtrl: MenuController, 
		public database: DatabaseService,
		public toastController: ToastController,
		public loadingController: LoadingController,
		public firebaseauthService: FirebaseauthService){

			this.newJugador = {
				id: '',
				nombre: '',
				usuario: "",
				fnacimiento: "",
				puntaje: 0,
				cvotos: 0,
				sexo: "",
				perfil: false,
				foto: "",
				ubicacion: "",
				html: '',
				password: ''
			}
			
			this.jugadorForm = this.formBuilder.group({
				usuario: '',
				contraseña: ''
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

  login(){
	  console.log(this.jugadorForm);
	  this.firebaseauthService.login(this.jugadorForm.value.usuario, this.jugadorForm.value.contraseña)
		  .then(res => {
			  console.log("usuario creado");
			  console.log(res);
			  
			  this.router.navigate(["/inicio"]);
		  })
		  .catch(err => {
			  this.presentToast(err,3000)
			  console.log("error" + err);
		  })
  }


}
