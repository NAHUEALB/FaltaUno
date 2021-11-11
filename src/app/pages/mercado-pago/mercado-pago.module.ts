import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MercadoPagoPageRoutingModule } from './mercado-pago-routing.module';

import { MercadoPagoPage } from './mercado-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MercadoPagoPageRoutingModule
  ],
  declarations: [MercadoPagoPage]
})
export class MercadoPagoPageModule {}
