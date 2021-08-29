import { FirebaseauthService } from './serv/firebaseauth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuscarPage } from './pages/buscar/buscar.page';
import { InicioPage } from './pages/inicio/inicio.page';
import { TabsPage } from './pages/tabs/tabs.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  options: Array<{ title: string, component: any, icon: string, ruta:string}>;
    constructor(
      private router: Router,
      public firebaseauthService: FirebaseauthService
    )
    {
      this.options = [
        { title: 'Inicio', component: InicioPage, icon:'home' ,  ruta:'inicio' },
        { title: 'Buscar', component: BuscarPage, icon: 'search',  ruta: 'buscar' },
        { title: 'Perfil', component: TabsPage, icon:'walk-outline',  ruta: 'tabs' },
        { title: 'Cerrar Sesion', component: InicioPage, icon: 'log-out-outline',  ruta: 'principal' }
      ]
    }

  openOptions(option){
    if(option.title == 'Cerrar Sesion'){
      this.firebaseauthService.logout();
    }
    this.router.navigate([`/${option.ruta}`]);
  }

}