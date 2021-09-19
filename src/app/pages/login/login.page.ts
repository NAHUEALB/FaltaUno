import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
	docSubscription;
	usuarioSubscription;
	msj = 'Cargando informacion de usuario';

	constructor(
	public formBuilder: FormBuilder,
	private router: Router,
	public menuCtrl: MenuController,
	public database: DatabaseService,
	public toastController: ToastController,
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
			usuario: new FormControl('', Validators.email),
			contraseña: new FormControl('', Validators.minLength(7)),
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

	login() {
		let user = this.jugadorForm.value.usuario;
		let pw = this.jugadorForm.value.contraseña;
    	this.firebaseauthService.login(user, pw)
		.then(() => {
			this.usuarioSubscription = this.firebaseauthService.getUserCurrent().subscribe(res =>{
				this.docSubscription = this.firebaseauthService.getDocumentById(this.enlace, res.uid).subscribe((document: any) =>{
					this.jugador = document;
					this.storage.set("jugador", document).then(()=>{
						this.router.navigate(['/inicio']);
					})
					this.docSubscription.unsubscribe();
				})
				this.usuarioSubscription.unsubscribe();
			});
		})
		.catch((err) => {
			let codigo: string = err.code;

			switch(codigo){
				case "auth/user-not-found":{
					this.presentToast("Usuario ingresado no existe", 3000);
					break;
				}
				case "auth/wrong-password":{
					this.presentToast("Contraseña incorrecta", 3000);	
					break;
				}
				default:{
					this.presentToast(err, 3000);
					break;
				}
			}
			
		});				
  	}
}
