import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalaPage } from './sala.page';

const routes: Routes = [
  {
    path: '',
    component: SalaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaPageRoutingModule {}
