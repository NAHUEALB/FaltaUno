import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PospartidoadminPage } from './pospartidoadmin.page';

const routes: Routes = [
  {
    path: '',
    component: PospartidoadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PospartidoadminPageRoutingModule {}
