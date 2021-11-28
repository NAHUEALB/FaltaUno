import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
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
	docSubscription;
	usuarioSubscription;

	enlace = 'Jugador';
	jugadorForm: FormGroup;
	jugador = {
		id: '',
		id_firebase: '',
		nombre: '',
		email: '',
		fnacimiento: '',
		puntaje: 0,
		cantidad_votos: 0,
		sexo: "",
		perfil: false,
		ubicacion: ' La Plata ',
	}; 
	
	localidades = ['La Plata'/*, 'Ensenada', 'Berisso'*/];
	msj = 'Cargando informacion de usuario';
	cargando = false;

	constructor(
	public formBuilder: FormBuilder,
	private router: Router,
	public menuCtrl: MenuController,
	public database: DatabaseService,
	public toastController: ToastController,
	public firebaseauthService: FirebaseauthService,
	private storage: Storage
	){
		this.jugadorForm = this.formBuilder.group({
			usuario: new FormControl('', Validators.email),
			contraseña: new FormControl('', Validators.minLength(7)),
		});
  	}

	ngOnInit() {}

	ionViewWillLeave() {
		if (this.docSubscription) this.docSubscription.unsubscribe();
		if (this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
	
	irAlInicio() {
		this.storage.set("jugador", this.jugador)
		.then(()=> this.router.navigate([`/inicio`]))
	}
	
	login() {
		this.cargando = true;
		let userEmail = this.jugadorForm.value.usuario;
		let userPassword = this.jugadorForm.value.contraseña;
    	this.firebaseauthService.login(userEmail, userPassword)
		.then(() => {
			this.usuarioSubscription = this.firebaseauthService.getUserCurrent().subscribe(res => {
				this.jugador.id_firebase = res.uid
				this.docSubscription = this.firebaseauthService.getDocumentById(this.enlace, res.uid).subscribe((document: any) =>{
					this.jugador.email = userEmail
					this.presentToast("Sesión iniciada con éxito", 3000);
					this.irAlInicio()
				})
			});
		})
		.catch((err) => {
			this.cargando = false;
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

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}
}
