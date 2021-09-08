import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroGooglePage } from './registro-google.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroGooglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroGooglePageRoutingModule {}
