import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
	selector: 'app-registrar',
	templateUrl: './registrar.page.html',
	styleUrls: ['./registrar.page.scss'],
})

export class RegistrarPage implements OnInit {
	docSubscription;
	usuarioSubscription;
	
	enlace = 'Jugador';
	jugadorForm: FormGroup;
	jugador = {
		id: '',
		idFirebase: '',
		nombre: '',
		password: '',
		email: '',
		fnacimiento: '',
		puntaje: 0,
		cantidad_votos: 0,
		sexo: "",
		perfil: false,
		ubicacion: ' La Plata ',
		pagado: 0
	};

	localidades = ["La Plata"/*, "Ensenada", "Berisso"*/];
	sexos = ["No binario", "Hombre", "Mujer"];
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
			nombrereg: '',
			usuario: new FormControl('', Validators.email),
			contrareg:new FormControl('', Validators.minLength(7)),
			fnacimiento:'',
			ubicacion: '',
			sexo: '',
		})
	}

	ngOnInit() {
	}

	ionViewWillEnter(){
		this.cargando = false;
		this.jugadorForm.reset();
	}

	ionViewWillLeave() {
		if (this.docSubscription) this.docSubscription.unsubscribe();
		if (this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}

	irAlLogin() {
		this.router.navigate([`/login`]);
	}

	crearJugador(){
		this.cargando = true;
		this.jugador.email = this.jugadorForm.value.usuario;
		this.jugador.password = this.jugadorForm.value.contrareg;
		this.jugador.nombre = this.jugadorForm.value.nombrereg;
		this.jugador.fnacimiento = this.jugadorForm.value.fnacimiento;
		this.jugador.ubicacion = this.jugadorForm.value.ubicacion;
		this.jugador.sexo = this.jugadorForm.value.sexo;
		setTimeout(() => {
			this.firebaseauthService.registrar(this.jugador.email, this.jugador.password)
			.then(res => {
				this.jugador.idFirebase = res.user.uid;	
				this.firebaseauthService.createDocument(this.jugador, this.enlace, res.user.uid);
				let querySql = {
					email: this.jugador.email,
					password: this.jugador.password,
					nombre: this.jugador.nombre,
					fnacimiento: this.jugador.fnacimiento,
					sexo: this.jugador.sexo,
					localidad: this.jugador.ubicacion,
					idFirebase: this.jugador.idFirebase,
					pagado: 0,
				}
				let requestSql = 'https://backend-f1-java.herokuapp.com/jugadores/crearjugador/' 
				fetch(requestSql, {
					method: "POST", 
					body: JSON.stringify(querySql),
					headers: {"Content-type": "application/json; charset=UTF-8"}
				})
				.then(res => res.json())
				.then(data => {
					this.presentToast("Gracias por registrarte, ingresá con tus credenciales para empezar a buscar partidos", 3000);
					this.irAlLogin()
				})
				.catch(err => this.presentToast(err, 3000))
			})
			.catch(err =>{
				this.cargando = false;
				if(err.code.includes("auth/email-already-in-use")){
					this.presentToast("💀 Correo electronico ya registrado", 3000);
					return
				}
				if(err.code.includes("auth/invalid-email")){
					this.presentToast("💀 Correo electronico con formato incorrecto", 3000);
					return
				}
				this.presentToast("💀 " + err, 3000);
			})		
		}, 300);
	}
	
	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}
}
