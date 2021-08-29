import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  nombre;
  constructor(private menuCtrl: MenuController,private router: Router) {
    // this.menuCtrl.enable(true);
    console.log(this.router.getCurrentNavigation().extras.state.usuario);
   }

  ngOnInit() {
    this.nombre = this.router.getCurrentNavigation().extras.state.usuario.nombre;
  }

}
