import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BuscarPage } from './pages/buscar/buscar.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { PerfilPage } from './pages/perfil/perfil.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  options: Array<{ title: string, component: any, icon: string, ruta:string}>;
    constructor(
      private platform: Platform,
      private router: Router
    ) {
      this.router.navigate(["perfil"]);
      this.options = [
        { title: 'Inicio', component: InicioPage, icon:'' ,  ruta:'inicio' },
        { title: 'Buscar', component: BuscarPage, icon: '',  ruta: 'buscar' },
        { title: 'Perfil', component: PerfilPage, icon:'',  ruta: 'perfil' }
      ]
      console.log("iniciar app");
      this.initializeApp();
    }
  
    initializeApp() {
      console.log("inicie app");
      this.platform.ready().then(() => {
        console.log("tamo ready");
      });
    }




  openOptions(option){
    console.log(option);
    console.log("me voy a ir"+option.ruta);
    this.router.navigate([`/${option.ruta}`]);
  }

}