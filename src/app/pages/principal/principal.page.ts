import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { AyudaPage } from '../ayuda/ayuda.page';
import { Router, NavigationExtras } from '@angular/router';

import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { FirebaseauthService } from 'src/app/serv/firebaseauth.service';
import { Jugador } from 'src/app/models/jugador';

@Component({
	selector: 'app-principal',
	templateUrl: './principal.page.html',
	styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

	jugador: Jugador;
	docSubscription: any;
	usuarioSubscription: any;
	enlace = "Jugador/";
	msj = "Sesión con Google iniciada con éxito";

	constructor(
		private menuCtrl: MenuController,
		private modalController: ModalController,
		private router: Router,
		public authService: FirebaseauthService,
		public toastController: ToastController,
		private storage: Storage) {
		this.menuCtrl.enable(false);
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
			ubicacion: '',
			html: '',
		}
	}

	async abrirModal() {
		const modal = await this.modalController.create({
			component: AyudaPage,
			cssClass: 'modal-css',
			swipeToClose: true,
			presentingElement: await this.modalController.getTop()
		});
		await modal.present();
	}

	ngOnInit() {
	}

	irAlRegistrar() {
		document.getElementById('bt-registrar').classList.add('bt-clicked');
		setTimeout(() => {
			this.router.navigate([`/registrar`]);
			document.getElementById('bt-registrar').classList.remove('bt-clicked');
		}, 300);
	}

	irAlLogin() {
		document.getElementById('bt-iniciar').classList.add('bt-clicked');
		setTimeout(() => {
			this.router.navigate([`/login`]);
			document.getElementById('bt-iniciar').classList.remove('bt-clicked');
		}, 300);
	}

	async irAlLoginGoogle() {
		try {
			this.authService.loginGoogle()
			.then(() => {
				this.usuarioSubscription = this.authService.getUserCurrent().subscribe(res => {
					this.docSubscription = this.authService.getDocumentById(this.enlace, res.uid).subscribe((document: any) => {
						if (document) {
							this.storage.clear();
							this.jugador = document;
							this.storage.set("jugador", document).then(() => {
								this.router.navigate(['/inicio']);
								this.presentToast(this.msj, 3000);
							});
						} else {
							let data = this.cargarJugador();
							data.id = res.uid;
							data.nombre = res.displayName.split(" ")[0];
							let authGoogle : NavigationExtras = {
								state: {
									data: data
								}
							}
							this.router.navigate(['registroGoogle'], authGoogle);
						}
					})
				})
			})
		} catch (err) {
			console.log("Detalles: " + err);
		}
	}

	irAlLoginFacebook() {
		console.log("ajsdkjasjkd te la CREISTE WEEEE JASKDJAKJSDKAJSD");
	}

	cargarJugador() {
		let data: Jugador;
		data = {
			id: '',
			nombre: '',
			usuario: '',
			fnacimiento: '2020-01-01',
			puntaje: 0,
			cvotos: 0,
			sexo: 'No binario',
			perfil: true,
			foto: '',
			ubicacion: 'No definida',
			html: '',
		}
		return data;
	}

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}

	ionViewWillLeave() {
		if (this.docSubscription) this.docSubscription.unsubscribe();
		if (this.usuarioSubscription) this.usuarioSubscription.unsubscribe();
	}
}


