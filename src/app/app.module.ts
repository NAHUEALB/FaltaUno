import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { IonicStorageModule } from '@ionic/storage-angular';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule, 
		IonicModule.forRoot(), 
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule,
		AngularFireAuthModule,
		AngularFireDatabaseModule,
		IonicStorageModule.forRoot(),
		ReactiveFormsModule
	],
	providers: [
		Storage,
		GoogleMaps,
		FormBuilder,
		FormsModule,
		SocialSharing,
		{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent],
})
export class AppModule {}
