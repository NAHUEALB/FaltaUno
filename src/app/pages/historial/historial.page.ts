import { Component, OnInit } from '@angular/core';
import { Partido } from 'src/app/models/partido';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  partidos=[];
  partido: Partido;
  stars = [];
  valoracion: number;
  
  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.partidos=[];
    let cantidad = Math.floor(Math.random() * (10 - 1)) + 1;
    for(let i=1; i < cantidad; i++){
      let golesEquipo = Math.floor(Math.random() * 20);
      let golesRival = Math.floor(Math.random() * 20);
      let puntuacion = (Math.random() * (5)).toFixed(2);
      this.partido = {
        resultado : golesEquipo + " - " + golesRival,
        fecha: "2" + i + "/09/2020",
        valoracion: parseFloat(puntuacion)
      }

      let resultado = {
        partido: this.partido,
        stars: []
      }
      
      for (let i=0; i<5; i++) {
        if (this.partido.valoracion - .75 >= i) resultado.stars.push("full")
        else if (this.partido.valoracion - .25 >= i)  resultado.stars.push("half")
        else  resultado.stars.push("null");
      }

      this.partidos.push(resultado);
    }
  }


  actualizarListado(value){
    setTimeout(() =>{
      console.info("Cerrar refresh");
      value.target.complete();
    }, 3000);
  }

}
