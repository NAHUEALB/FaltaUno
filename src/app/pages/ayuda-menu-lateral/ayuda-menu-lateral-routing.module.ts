import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AyudaMenuLateralPage } from './ayuda-menu-lateral.page';

const routes: Routes = [
  {
    path: '',
    component: AyudaMenuLateralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AyudaMenuLateralPageRoutingModule {}
