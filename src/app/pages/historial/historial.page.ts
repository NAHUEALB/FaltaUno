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
  constructor() {

   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.partidos=[];
    for(let i=1; i < 10 ; i++){
      this.partido = {
        resultado : i+" - 2",
        fecha: i*2+"/"+i*3+"/"+i*4
      }
      this.partidos.push(this.partido);
    }
  }


  actualizarListado(value){
    console.log("REFRESH");
    console.log(value);
    setTimeout(() =>{
      console.info("Cerrar refresh");
      value.target.complete();
    }, 1000);
  }

}
