import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss']
})

export class LoginPage implements OnInit {
	enlace = 'Jugador';
	jugadorForm: FormGroup;
	jugador: Jugador; 
	jugadorExtra: Jugador;
	localidades = ['La Plata', 'Ensenada', 'Berisso'];
	getDocumentSubscription;

	constructor(
	public formBuilder: FormBuilder,
	private router: Router,
	public menuCtrl: MenuController,
	public database: DatabaseService,
	public toastController: ToastController,
	public loadingController: LoadingController,
	public firebaseauthService: FirebaseauthService,
	private storage: Storage
	){
		this.jugador = {
			id:"0",
			nombre: '',
			usuario: '',
			fnacimiento: '',
			puntaje: 0,
			cvotos: 0,
			sexo: '',
			perfil: false,
			foto: '',
			ubicacion: '',
			html: '',
		}

		this.jugadorForm = this.formBuilder.group({
			usuario: '',
			contraseña: '',
		});
  	}

	ngOnInit() {}

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}

	async login() {
		let user = this.jugadorForm.value.usuario;
		let pw = this.jugadorForm.value.contraseña;
    	this.firebaseauthService.login(user, pw)
		.then(() => {
			this.firebaseauthService.getUserCurrent().subscribe(res =>{
				this.firebaseauthService.getDocumentById(this.enlace, res.uid).subscribe((document: any) =>{
					this.jugador = document;
					this.storage.set("jugador", document);
					this.router.navigate(['/inicio']);
				})
			});
		})
		.catch((err) => {
			this.presentToast(err, 3000);
			console.log('!!!error!!!:' + err);
		});				
  	}

	ionViewWillLeave(){
		if(this.getDocumentSubscription){
			this.getDocumentSubscription.unsubscribe();
		}
	}
}
