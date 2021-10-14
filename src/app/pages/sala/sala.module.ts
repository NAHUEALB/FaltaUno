import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalaPageRoutingModule } from './sala-routing.module';

import { SalaPage } from './sala.page';
import { MapaPageModule } from '../mapa/mapa.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalaPageRoutingModule,
    MapaPageModule
  ],
  declarations: [SalaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalaPageModule {}
