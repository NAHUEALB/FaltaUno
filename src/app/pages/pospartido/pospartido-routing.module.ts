import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PospartidoPage } from './pospartido.page';

const routes: Routes = [
  {
    path: '',
    component: PospartidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PospartidoPageRoutingModule {}
