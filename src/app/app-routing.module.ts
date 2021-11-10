import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./pages/ayuda/ayuda.module').then( m => m.AyudaPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'editar',
    loadChildren: () => import('./pages/editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registroGoogle',
    loadChildren: () => import('./pages/registro-google/registro-google.module').then( m => m.RegistroGooglePageModule)
  },
  {
    path: 'sala',
    loadChildren: () => import('./pages/sala/sala.module').then( m => m.SalaPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'ayuda-menu-lateral',
    loadChildren: () => import('./pages/ayuda-menu-lateral/ayuda-menu-lateral.module').then( m => m.AyudaMenuLateralPageModule)
  },  {
    path: 'editar-sala',
    loadChildren: () => import('./pages/editar-sala/editar-sala.module').then( m => m.EditarSalaPageModule)
  },
  {
    path: 'partido',
    loadChildren: () => import('./pages/partido/partido.module').then( m => m.PartidoPageModule)
  },
  {
    path: 'pospartido',
    loadChildren: () => import('./pages/pospartido/pospartido.module').then( m => m.PospartidoPageModule)
  },
  {
    path: 'pospartidoadmin',
    loadChildren: () => import('./pages/pospartidoadmin/pospartidoadmin.module').then( m => m.PospartidoadminPageModule)
  }

  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }