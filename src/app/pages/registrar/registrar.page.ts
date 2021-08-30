import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

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
	enlace = 'Jugador';
	jugadorForm: FormGroup;
	jugador: Jugador;
	getDocumentSubscription;

	localidades = ["La Plata", "Ensenada", "Berisso"];
	sexos = ["No especificado", "Hombre", "Mujer", "No binario"];

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
			sexo: "no binario",
			perfil: false,
			foto: '',
			ubicacion: this.localidades[1],
			html: '',
		}

		this.jugadorForm = this.formBuilder.group({
			nombre: '',
			usuario: '',
			contraseña:new FormControl('', Validators.minLength(7)),
			fnacimiento:'',
			ubicacion:'',
			sexo:'',
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




	crearJugador(){
		const boton = document.getElementById("boton-submit");
		boton.innerHTML = "Cargando..."
		this.firebaseauthService.registrar(this.jugadorForm.value.usuario,this.jugadorForm.value.contraseña)
		.then(res => {
			let data = this.cargarJugador();			
			this.firebaseauthService.createDocument<Jugador>(data, this.enlace, res.user.uid)
			//this.router.navigate(["/login"]);
		})
		.then(res => {
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
			nombre : this.jugadorForm.value.nombre,
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
		if(this.getDocumentSubscription){
			this.getDocumentSubscription.unsubscribe();
		}
	}
}
