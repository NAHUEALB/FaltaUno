import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyudaPagoPageRoutingModule } from './ayuda-pago-routing.module';

import { AyudaPagoPage } from './ayuda-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyudaPagoPageRoutingModule
  ],
  declarations: [AyudaPagoPage]
})
export class AyudaPagoPageModule {}
