import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  nombre: string;
  fechaNacimiento: Date;
  localidad: string;

  constructor() { 
    this.nombre = 'ariel';
    this.fechaNacimiento =  new Date();  
    this.localidad = "nahue";
  }

  ngOnInit() {
  }

  localidadChange(value){
    console.log(value.detail.value);
  }

  registrarPerfil(element){
    console.log(element);
  }
}
