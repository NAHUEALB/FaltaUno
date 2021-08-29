import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, MenuController } from '@ionic/angular';

import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  enlace = 'prueba/';
  jugadorForm: FormGroup;
  newJugador: Jugador;
  localidades = ['La Plata', 'Ensenada', 'Berisso'];
  getDocumentSubscription;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    public menuCtrl: MenuController,
    public database: DatabaseService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public firebaseauthService: FirebaseauthService
  ) {

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

	login() {
    console.log(this.jugadorForm);
    this.firebaseauthService.login(this.jugadorForm.value.usuario, this.jugadorForm.value.contraseña)
      .then(res => {
		this.getDocumentSubscription = this.firebaseauthService.getDocumentById(this.enlace,res.user.uid).subscribe(cc =>{
			let usuarioExtra : NavigationExtras = {
				state: {
					usuario: cc
				}
			}
			this.router.navigate(['/inicio'], usuarioExtra);
		})

      })
      .catch((err) => {
        this.presentToast(err, 3000);
        console.log('error' + err);
      });
  	}

	ionViewWillLeave(){
		if(this.getDocumentSubscription){
			this.getDocumentSubscription.unsubscribe();
		}
	}
}
