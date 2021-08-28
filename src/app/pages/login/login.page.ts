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
		public loadingController: LoadingController){

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
				password: '',
				localidad: this.localidades[0],
			})

	}

  ngOnInit() {
  }

}
