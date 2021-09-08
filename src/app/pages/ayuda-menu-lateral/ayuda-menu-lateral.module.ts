import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AyudaMenuLateralPageRoutingModule } from './ayuda-menu-lateral-routing.module';

import { AyudaMenuLateralPage } from './ayuda-menu-lateral.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyudaMenuLateralPageRoutingModule
  ],
  declarations: [AyudaMenuLateralPage]
})
export class AyudaMenuLateralPageModule {}
