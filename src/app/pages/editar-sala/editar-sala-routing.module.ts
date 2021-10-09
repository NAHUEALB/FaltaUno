import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarSalaPage } from './editar-sala.page';

const routes: Routes = [
  {
    path: '',
    component: EditarSalaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarSalaPageRoutingModule {}
