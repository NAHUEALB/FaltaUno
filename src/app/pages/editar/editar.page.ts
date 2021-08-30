import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Jugador } from 'src/app/models/jugador';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})

export class EditarPage implements OnInit {
	jugadorForm: FormGroup;
	jugador: Jugador;
	localidades = ["La Plata", "Ensenada", "Berisso"];
	getDocumentSubscription;

	constructor(
	public menuCtrl: MenuController, 
	public formBuilder: FormBuilder
	){ 
		this.jugador = {
			id: "1",
			nombre: 'Pepe',
			usuario: "pepito123",
			fnacimiento: "1995-02-26",
			puntaje: 22,
			cvotos: 8,
			sexo: "no binario",
			perfil: false,
			foto: "foto",
			ubicacion: this.localidades[1],
			html: ''
		}

		this.jugadorForm = this.formBuilder.group({
			nombre: this.jugador.nombre,
			localidad: this.jugador.ubicacion,
			edad: this.jugador.fnacimiento,
			sexo: this.jugador.sexo
		})
	}

	ngOnInit() {
		this.menuCtrl.enable(true);
	}

	radioChange(value){
		console.log(value.detail.value);
	}

	onSubmit(){
		//Esto deberiamos mandarlo a la bd.
		//En el perfil deberiamos poner que cada vez que se entre, se recargue la informacion de ese jugador
		//Como saber que jugador es? proponer el uso del DNI.
		console.log(this.jugadorForm.value);
	}

	ionViewWillLeave(){
		if(this.getDocumentSubscription){
			this.getDocumentSubscription.unsubscribe();
		}
	}
}
