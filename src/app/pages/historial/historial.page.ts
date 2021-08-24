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
    for(let i=1; i < 10 ; i++){
      this.partido = {
        resultado : i+" - 2",
        fecha: i*2+"/"+i*3+"/"+i*4,
        valoracion: parseFloat((22 / 8).toFixed(2))
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
    }, 1000);
  }

}
