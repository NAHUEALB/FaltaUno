import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Utilities } from 'src/app/utilities/utils';

@Component({
	selector: 'app-registrar',
	templateUrl: './registrar.page.html',
	styleUrls: ['./registrar.page.scss'],
})

export class RegistrarPage implements OnInit {
	enlace = 'Jugador';
	jugadorForm: FormGroup;
	jugador: Jugador;
	docSubscription;
	usuarioSubscription;
	msj="Cargando usuario"

	localidades = ["La Plata", "Ensenada", "Berisso"];
	sexos = ["No binario", "Hombre", "Mujer"];

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
		// this.menuCtrl.enable(false);
		this.jugador = {
			id: '',
			nombre: '',
			usuario: '',
			fnacimiento: '',
			puntaje: 0,
			cvotos: 0,
			sexo: "",
			perfil: false,
			foto: '',
			ubicacion: this.localidades[1],
			html: '',
		}

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


	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}

	crearJugador(){
		const boton = document.getElementById("boton-submit");
		boton.innerHTML = "Cargando...";
		let user= this.jugadorForm.value.usuario;
		let pw = this.jugadorForm.value.contrareg;
		console.log(user + ": " + pw);
		Utilities.presentLoading(this.loadingController, this.msj);
		this.firebaseauthService.registrar(user, pw)
		.then(res => {
			let data = this.cargarJugador();
			data.id = res.user.uid;	
			this.firebaseauthService.createDocument<Jugador>(data, this.enlace, res.user.uid);
			let user = this.jugadorForm.value.usuario;
			let pw = this.jugadorForm.value.contrareg;
			this.firebaseauthService.login(user, pw)
			.then(() => {
				this.usuarioSubscription = this.firebaseauthService.getUserCurrent().subscribe(res =>{
					this.docSubscription = this.firebaseauthService.getDocumentById(this.enlace, res.uid).subscribe((document: any) =>{
						this.storage.clear();
						this.jugador = document;
						this.storage.set("jugador", document).then(() => {
							this.loadingController.dismiss();
							this.router.navigate(['/inicio']);
						})
					})
				});
			})
			.catch((err) => {
				this.presentToast(err, 3000);
				console.log('error' + err);
			});
		})
		.catch(err =>{
			this.presentToast(err,3000)
			console.log("error"+ err);
		})		
	}


	cargarJugador(){
		let data: Jugador;
		data={
			id : '',
			nombre : this.jugadorForm.value.nombrereg,
			usuario : '',
			fnacimiento: this.jugadorForm.value.fnacimiento,
			puntaje : 0,
			cvotos : 0,
			sexo : this.jugadorForm.value.sexo,
			perfil : true,
			foto : '',
			ubicacion : this.jugadorForm.value.ubicacion,
			html : '',
		}
		return data;
	}

	ionViewWillLeave(){
		if(this.docSubscription) this.docSubscription.unsubscribe();
		if(this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
}
