import { PerfilPage } from './pages/perfil/perfil.page';
import { MenuController } from '@ionic/angular';
import { FirebaseauthService } from './serv/firebaseauth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuscarPage } from './pages/buscar/buscar.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { AyudaMenuLateralPage } from './pages/ayuda-menu-lateral/ayuda-menu-lateral.page';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  options: Array<{ title: string, component: any, icon: string, ruta:string}>;
	constructor(
	public menuCtrl: MenuController,
	private modalController: ModalController,
	private router: Router,
	public firebaseauthService: FirebaseauthService,
	public storage: Storage,
	public toastController: ToastController
	){
		this.options = [
			{ title: 'Inicio', component: InicioPage, icon:'home' ,  ruta:'inicio' },
			{ title: 'Buscar', component: BuscarPage, icon: 'search',  ruta: 'buscar' },
			{ title: 'Perfil', component: PerfilPage, icon:'walk-outline',  ruta: 'perfil' },
			{ title: 'Cerrar Sesion', component: InicioPage, icon: 'log-out-outline',  ruta: 'principal' }
		]
    }


	async abrirModal() {
		this.menuCtrl.close();
		const modal = await this.modalController.create({
		  component: AyudaMenuLateralPage,
		  cssClass:'modal-css',
		  swipeToClose:true,
		  presentingElement: await this.modalController.getTop()

		});
		await modal.present();
	}


	openOptions(option){
		if(option.title == 'Cerrar Sesion'){
			this.menuCtrl.enable(false);
			this.firebaseauthService.logout();
			this.router.navigate([`/principal`]);
			this.presentToast("Sesión cerrada con éxito", 3000);
		} else this.router.navigate([`/${option.ruta}`]);
		
	}

	async ngOnInit() {
		await this.storage.create();
	}

	async presentToast(msg: string, time: number) {
		const toast = await this.toastController.create({
			message: msg,
			duration: time,
		});
		toast.present();
	}

}