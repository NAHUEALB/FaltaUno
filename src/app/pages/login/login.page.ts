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
		password: '',
		id_firebase: '',
		nombre: '',
		email: '',
		fnacimiento: '',
		puntaje: 0,
		cantidad_votos: 0,
		sexo: "",
		perfil: false,
		ubicacion: ' La Plata ',
		pagado: 0
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
		.then(()=> setTimeout(() => this.router.navigate([`/inicio`]), 100))
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
					this.jugador.password = userPassword
					let requestSql = 'https://backend-f1-java.herokuapp.com/jugadores/firebase/' + this.jugador.id_firebase
					fetch(requestSql)
					.then((res) => res.json())
					.then((data) => {
						console.log(data)
						if (data) {
							this.jugador.id = data.idjugador
							this.jugador.password = data.password
							this.jugador.nombre = data.nombre
							this.jugador.sexo = data.sexo
							this.jugador.fnacimiento = data.fnacimiento
							this.jugador.cantidad_votos = data.cantVotos
							this.jugador.puntaje = data.puntaje
							this.presentToast("Sesión iniciada con éxito ✅", 1500);
							this.irAlInicio()
						} else {
							this.presentToast("💀 Hubo un error recuperando al jugador de Firebase", 4000);
						}
					})
					.catch(() => this.presentToast("💀 Hubo un problema recuperando al jugador de Firebase", 2000))					
				})
			});
		})
		.catch((err) => {
			this.cargando = false;
			let codigo: string = err.code;
			switch(codigo){
				case "auth/user-not-found":{
					this.presentToast("💀 Usuario ingresado no existe", 3000);
					break;
				}
				case "auth/wrong-password":{
					this.presentToast("💀 Contraseña incorrecta", 3000);	
					break;
				}
				default:{
					this.presentToast("💀 "+err, 3000);
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
