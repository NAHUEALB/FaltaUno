import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PospartidoadminPageRoutingModule } from './pospartidoadmin-routing.module';

import { PospartidoadminPage } from './pospartidoadmin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PospartidoadminPageRoutingModule
  ],
  declarations: [PospartidoadminPage]
})
export class PospartidoadminPageModule {}
