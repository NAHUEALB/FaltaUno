import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroGooglePageRoutingModule } from './registro-google-routing.module';

import { RegistroGooglePage } from './registro-google.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegistroGooglePageRoutingModule
  ],
  declarations: [RegistroGooglePage]
})
export class RegistroGooglePageModule {}
