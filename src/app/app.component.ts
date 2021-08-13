import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
      private router: Router
    ) {
      this.options = [
        { title: 'Inicio', component: InicioPage, icon:'home' ,  ruta:'inicio' },
        { title: 'Buscar', component: BuscarPage, icon: 'search',  ruta: 'buscar' },
        { title: 'Perfil', component: PerfilPage, icon:'walk-outline',  ruta: 'registrar' }
      ]
    }

  openOptions(option){
    this.router.navigate([`/${option.ruta}`]);
  }

}