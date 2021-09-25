import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },  {
    path: 'ayuda-menu-lateral',
    loadChildren: () => import('./ayuda-menu-lateral/ayuda-menu-lateral.module').then( m => m.AyudaMenuLateralPageModule)
  },
  {
    path: 'registro-google',
    loadChildren: () => import('./registro-google/registro-google.module').then( m => m.RegistroGooglePageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
