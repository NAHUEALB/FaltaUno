import { Storage } from '@ionic/storage-angular';
import { FirebaseauthService } from 'src/app/serv/firebaseauth.service';
import { Router } from '@angular/router';
import { Jugador } from './../../models/jugador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-registro-google',
	templateUrl: './registro-google.page.html',
	styleUrls: ['./registro-google.page.scss'],
})
export class RegistroGooglePage implements OnInit {
	enlace = 'Jugador';
	jugadorForm: FormGroup;
	jugador: Jugador;
	docSubscription;
	localidades = ["La Plata", "Ensenada", "Berisso"];
	sexos = ["No binario", "Hombre", "Mujer"];
	cargando = false;

  	constructor(public formBuilder: FormBuilder,
	private router: Router,
	public firebaseauthService: FirebaseauthService,
	private storage: Storage) { 
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
			fnacimiento:'',
			ubicacion: '',
			sexo: '',
		});
		this.jugador = this.router.getCurrentNavigation().extras.state.data;
	}

	ngOnInit() {
		
	}

  
	crearJugador(){
		this.cargando = true;
		this.jugador.fnacimiento = this.jugadorForm.value.fnacimiento;
		this.jugador.ubicacion = this.jugadorForm.value.ubicacion;
		this.jugador.sexo = this.jugadorForm.value.sexo;
		this.firebaseauthService.createDocument<Jugador>(this.jugador, this.enlace, this.jugador.id);
		this.docSubscription = this.firebaseauthService.getDocumentById(this.enlace, this.jugador.id).subscribe((document: any) =>{
			this.storage.clear();
			console.log(document);
			this.jugador = document;
			this.storage.set("jugador", document).then(() => {
				this.router.navigate(['/inicio']);
			})
		})
	}

	ionViewWillLeave() {
		this.cargando = false;
		if (this.docSubscription) this.docSubscription.unsubscribe();
	}


}
