import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

  usuarioForm: FormGroup;
  usuario: Usuario;
  localidades = ["La Plata", "Berazategue", "Tu vieja"];

  constructor(public formBuilder: FormBuilder) { 
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
      nombre: this.usuario.nombre,
      localidad: this.usuario.ubicacion,
      edad: this.usuario.fnacimiento,
      sexo: this.usuario.sexo
    })

  }

  ngOnInit() {

  }

  radioChange(value){
    console.log(value.detail.value);
  }

  onSubmit(){
    //Esto deberiamos mandarlo a la bd.
    //En el perfil deberiamos poner que cada vez que se entre, se recargue la informacion de ese usuario
    //Como saber que usuario es? proponer el uso del DNI.
    console.log(this.usuarioForm.value);
  }

}
