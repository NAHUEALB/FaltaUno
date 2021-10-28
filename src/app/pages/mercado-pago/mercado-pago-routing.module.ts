import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MercadoPagoPage } from './mercado-pago.page';

const routes: Routes = [
  {
    path: '',
    component: MercadoPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MercadoPagoPageRoutingModule {}
