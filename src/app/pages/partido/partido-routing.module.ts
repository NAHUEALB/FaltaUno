import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartidoPage } from './partido.page';

const routes: Routes = [
  {
    path: '',
    component: PartidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartidoPageRoutingModule {}
