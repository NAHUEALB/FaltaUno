import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarSalaPageRoutingModule } from './editar-sala-routing.module';

import { EditarSalaPage } from './editar-sala.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarSalaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditarSalaPage]
})
export class EditarSalaPageModule {}
