import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AyudaPagoPage } from './ayuda-pago.page';

const routes: Routes = [
  {
    path: '',
    component: AyudaPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AyudaPagoPageRoutingModule {}
