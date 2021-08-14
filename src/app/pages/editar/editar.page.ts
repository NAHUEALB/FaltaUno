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

  constructor(public formBuilder: FormBuilder) { 
    this.usuario = {
			nombre: 'Pepe',
			nomUsuario: "pepito123",
			fnacimiento: "1995-02-26",
			puntajeTotal: 22,
			votosTotal: 8,
			sexo: "masculino",
			perfil: false,
			foto: "foto",
			ubicacion: "La Plata",
		}

    this.usuarioForm = this.formBuilder.group({
      nombre: this.usuario.nombre,
      localidad: this.usuario.ubicacion,
      edad: this.usuario.fnacimiento
    })
  }

  ngOnInit() {

  }

  radioChange(value){
    console.log(value.detail.value);
  }

  onSubmit(){
    console.log(this.usuarioForm.value);
  }

}
