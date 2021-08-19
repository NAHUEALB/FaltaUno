import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  usuarioForm: FormGroup;
  usuario: Usuario;
  localidades = ["La Plata", "Berazategue", "Tu vieja"];

  constructor(public formBuilder: FormBuilder, private router: Router, public menuCtrl: MenuController) { 

    // this.menuCtrl.enable(false, 'slideMenu');

    this.usuario = {
			nombre: 'Pepe',
			nomUsuario: "pepito123",
			fnacimiento: "1995-02-26",
			puntajeTotal: 22,
			votosTotal: 8,
			sexo: "no binario",
			perfil: false,
			foto: "foto",
			ubicacion: this.localidades[1]
		}


    this.usuarioForm = this.formBuilder.group({
      nombre: '',
      localidad: this.usuario.ubicacion,
      edad: '',
      sexo: ''
    })

  }

  ngOnInit() {
  }

  onSubmit(){

    this.usuario.nombre = this.usuarioForm.value.nombre;
    

    console.log(this.usuario);
    let usuarioExtra : NavigationExtras = {
			state: {
				usuario: this.usuario
			}
		}
		this.router.navigate(['inicio'], usuarioExtra);
	}
  
}
