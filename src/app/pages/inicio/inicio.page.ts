import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor() {
    console.log("Constructor del inicio");
   }

  ngOnInit() {
  }


  ionViewWillLeave(){
    console.log("Me fui del inicio");
  }
}
