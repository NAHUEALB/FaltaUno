import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Jugador } from 'src/app/models/jugador';
import { DatabaseService } from 'src/app/serv/database.service';

@Component({
	selector: 'app-registrar',
	templateUrl: './registrar.page.html',
	styleUrls: ['./registrar.page.scss'],
})

export class RegistrarPage implements OnInit {
	jugadorForm: FormGroup;
	newJugador: Jugador;

	localidades = ["La Plata", "Berazategue", "Tu vieja"];

	constructor(public formBuilder: FormBuilder, private router: Router, public menuCtrl: MenuController, public database: DatabaseService) { 
		// this.menuCtrl.enable(false, 'slideMenu');
		this.newJugador = {
			id: '',
			nombre: 'Pepe',
			usuario: "pepito123",
			fnacimiento: "2000-01-01",
			puntaje: 0,
			cvotos: 0,
			sexo: "no binario",
			perfil: false,
			foto: "foto",
			ubicacion: this.localidades[1],
			html: ''
		}

		this.jugadorForm = this.formBuilder.group({
			nombre: '',
			localidad: this.newJugador.ubicacion,
			edad: '',
			sexo: ''
		})
	}

	ngOnInit() {
		console.log("Vista de registrar cargada!");
	}

	onSubmit(){
		this.newJugador.nombre = this.jugadorForm.value.nombre;
		let jugadorExtra : NavigationExtras = {
			state: {
				jugador: this.newJugador
			}
		}
		this.router.navigate(['inicio'], jugadorExtra);
		
		console.log("vamos a guardar esto: ");
		console.log(this.newJugador);


		const data = this.newJugador;
		data.id = this.database.createId();
		const link = 'Jugadores';
		this.database.createDocument<Jugador>(data, link);
	}
}
