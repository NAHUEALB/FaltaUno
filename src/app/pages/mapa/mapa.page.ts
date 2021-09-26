import { Router } from '@angular/router';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent } from '@ionic-native/google-maps/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: GoogleMap;
  latitud;
  longitud;
  calle = "";
  nombreCancha = "";

  constructor(private router: Router) { 
    console.log(this.router.getCurrentNavigation().extras.state.cancha);
    let cancha = this.router.getCurrentNavigation().extras.state.cancha;
    this.nombreCancha = cancha.cancha;
    this.latitud= cancha.latitud;
    this.longitud= cancha.longitud;
    this.calle = cancha.direccion;
  }

  ionViewWillLeave(){
   this.map.one(GoogleMapsEvent.MAP_READY).then(()=> {
    this.map.off();
   });
  }

  cargarMapa(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target:{
          lat: this.latitud,
          lng: this.longitud
        },
        zoom: 15,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.setMyLocationButtonEnabled(true);
    this.map.setMyLocationEnabled(true);
    this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
      this.map.moveCamera({
        target:{
          lat: this.latitud,
          lng: this.longitud
        },
        zoom: 15,
        tilt: 30
      });
      
      this.map.addMarker({
        title:this.nombreCancha,
        icon:'red',
        animation:'BOUNCE',
        position:{
          lat: this.latitud,
          lng: this.longitud
        }
      });
    })
    .catch(error => {
      console.error(`${this.constructor.name}`+ error)
    })
  }

  ngOnInit() {
    this.cargarMapa();
  }

}
