import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent } from '@ionic-native/google-maps/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: GoogleMap;
  latitud
  longitud
  calle = "calle 7";
  
  constructor() { 
    this.latitud= -34.919550;
    this.longitud= -57.943218;
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
        title:'Cancha: Estadio 7',
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
