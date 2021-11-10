import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PospartidoPageRoutingModule } from './pospartido-routing.module';

import { PospartidoPage } from './pospartido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PospartidoPageRoutingModule
  ],
  declarations: [PospartidoPage]
})
export class PospartidoPageModule {}
