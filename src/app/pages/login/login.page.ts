import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';
import { Utilities } from 'src/app/utilities/utils';

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

	USUARIO_NO_EXISTE: string = "auth/user-not-found"

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
		Utilities.presentLoading(this.loadingController, this.msj);
		let user = this.jugadorForm.value.usuario;
		let pw = this.jugadorForm.value.contraseña;
    	this.firebaseauthService.login(user, pw)
		.then(() => {
			this.usuarioSubscription = this.firebaseauthService.getUserCurrent().subscribe(res =>{
				this.docSubscription = this.firebaseauthService.getDocumentById(this.enlace, res.uid).subscribe((document: any) =>{
					this.jugador = document;
					this.storage.set("jugador", document).then(()=>{
						this.loadingController.dismiss();
						this.router.navigate(['/inicio']);
					})
				})
			});
		})
		.catch((err) => {
			this.loadingController.dismiss();
			let codigo: string = err.code;

			//No se porque no funciona
			// switch(codigo){
			// 	case this.USUARIO_NO_EXISTE:{
			// 		this.presentToast("Usuario ingresado no existe", 3000);
			// 	}
			// 	case "auth/wrong-password":{
			// 		this.presentToast("Contraseña incorrecta", 3000);	
			// 	}
			// }

			if(codigo.includes("auth/user-not-found")){
				this.presentToast("Usuario ingresado no existe", 3000);
			}else{
				if(codigo.includes("auth/wrong-password")){
					this.presentToast("Contraseña incorrecta", 3000);
				}else{
					this.presentToast(err, 3000);
				}
			}
			
		});				
  	}

	ionViewWillLeave(){
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
}
