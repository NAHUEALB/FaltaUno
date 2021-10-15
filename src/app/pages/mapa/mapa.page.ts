import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent } from '@ionic-native/google-maps/ngx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import {Map, marker, tileLayer} from "leaflet"


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: GoogleMap;
  // latLong = [-34.9228288,-57.9584442,17];
  // map: Map;
  // marker: marker;
  latitud;
  longitud;
  calle = "";
  nombreCancha = "";

  constructor(private router: Router) { 
    let cancha = this.router.getCurrentNavigation().extras.state.cancha;
    this.nombreCancha = cancha.nombre;
    this.latitud= cancha.lat;
    this.longitud= cancha.lon;
    this.calle = cancha.direccion;
  }
  ionViewWillLeave(){
   this.map.one(GoogleMapsEvent.MAP_READY).then(()=> {
    this.map.off();
   });
  }

//   showMap() {
//     this.map = new Map('myMap').setView(this.latLong, 30);
//     tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);
//     this.showMarker(this.latLong);
//     this.map.invalidateSize()
//   }

// showMarker(latLong) {
//     this.marker = marker(latLong, 15);
//     this.marker.addTo(this.map)
//     .bindPopup(this.nombreCancha);
//     this.map.setView(latLong);
// }


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
        title: this.nombreCancha,
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
    // this.showMap();
  }

}