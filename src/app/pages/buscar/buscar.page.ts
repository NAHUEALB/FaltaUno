import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Cancha } from 'src/app/models/cancha';
import { Jugador } from 'src/app/models/jugador';
import { Sala } from 'src/app/models/sala';
import { FirebaseauthService } from './../../serv/firebaseauth.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {
  iconName: String;
  iconColor: String;
  docSubscription;
  canchaSubscription;
  puentes: any;

  partidosSql = []

  partidos: Sala[] = [
    {
      id: '1',
      nombre: 'Cargando...',
      slotsOcupados: 0,
      slotsTotales: 10,
      hora: '00:00',
      sexo: ' Mixto ',
      estado: 'Sala pública',
      equipoRed: [],
      equipoBlue: [],
    },
  ];

  distancias = {
    Megastadio: 3,
    'Estadio 7': 2,
    'Cancha La Lora': 6,
    'Cancha Loca': 5,
  };

  constructor(
    private router: Router,
    private storage: Storage,
    public firebaseauthService: FirebaseauthService,
    public http: HttpClient
  ) {}

  ngOnInit() {
    this.partidos.forEach((unPartido) => {
      this.setSexo(unPartido);
      this.setColorSlot(unPartido);
      this.setOrden(unPartido);
    });
    this.ordenarPartidos(this.partidos);
  }

  irAlInicio() {
    this.router.navigate([`/inicio`]);
  }

  setSexo(elem) {
    switch (elem.sexo) {
      case ' Masculino ':
        elem.iconName = 'male-outline';
        elem.iconColor = 'icon-hombre';
        break;
      case ' Femenino ':
        elem.iconName = 'female-outline';
        elem.iconColor = 'icon-mujer';
        break;
      case ' Mixto ':
        elem.iconName = 'male-female-outline';
        elem.iconColor = 'icon-nobin';
        break;
    }
  }

  setColorSlot(elem) {
    elem.optionFlama = '';
    if (elem.slotsOcupados < 5) {
      elem.slotColor = 'slot-disponible';
    } else if (elem.slotsOcupados < 8) {
      elem.slotColor = 'slot-popular';
    } else {
      elem.optionFlama = 'flama';
      elem.slotColor = 'slot-ocupado';
    }
  }

  setOrden(elem) {
    let now = new Date();
    let horaNow = now.getHours();
    let horaPartido = elem.hora.split(':')[0] - 0;
    let tiempo = Math.max(0, Math.floor(horaPartido - horaNow));
    let slots = Math.floor(10 - elem.slotsOcupados);
    let distancia = Math.floor(this.distancias[elem.cancha] * (4 / 3));
    elem.orden = tiempo + slots + distancia;
  }

  ordenarPartidos(partidos) {
    partidos.sort(function (a, b) {
      return a.orden - b.orden;
    });
  }

  swapAMapa() {
    document.getElementById('perfil-icon-a-mapa').style.display = 'none';
    document.getElementById('perfil-icon-a-lista').style.display = 'block';
    document.getElementById('blk-lista').style.display = 'none';
    document.getElementById('blk-mapa').style.display = 'block';
  }

  swapALista() {
    document.getElementById('perfil-icon-a-mapa').style.display = 'block';
    document.getElementById('perfil-icon-a-lista').style.display = 'none';
    document.getElementById('blk-lista').style.display = 'block';
    document.getElementById('blk-mapa').style.display = 'none';
  }

  cargarPartidos() {
    this.storage.get('jugador').then((jugador) => {
      let requestSql = 'https://backend-f1-java.herokuapp.com/partido/'
      fetch(requestSql)
      .then((res) => res.json())
      .then((data) => {
        this.partidosSql = []
        console.log(data)
        data.forEach(p => {
          let ids = [p.idJug1, p.idJug2, p.idJug3, p.idJug4, p.idJug5, p.idJug6, p.idJug7, p.idJug8, p.idJug9, p.idJug10]
          let idsNoVacias = ids.filter(jid => jid !== 0)
          let nuevoPartido = {
            nombre: p.sala,
            estado: "Sala pública",
            slotsOcupados: idsNoVacias.length,
            slotsTotales: 10,
            sexo: p.sexo,
            hora: p.hora + ":00"
          }
          this.partidosSql.push(nuevoPartido)          
        });
        console.log(this.partidosSql)
        this.partidosSql.forEach((unPartido) => {
          this.setSexo(unPartido);
          this.setColorSlot(unPartido);
          this.setOrden(unPartido);
        });
        this.ordenarPartidos(this.partidosSql);
      })
    });
  }

  irALaSala(partido) {
    let requestSql = 'https://backend-f1-java.herokuapp.com/partido/'+partido.idPartido
    fetch(requestSql)
    .then((res) => res.json())
    .then((data) => {
      this.partidosSql = []
      console.log(data)
      data.forEach(p => {
        let canchaExtra: NavigationExtras = {
          state: {
            nombre_cancha: partido.cancha.nombre_cancha,
            direccion: partido.cancha.direccion,
            precio: partido.cancha.precio,
            partido: partido
          },
        };
        this.router.navigate(['sala'], canchaExtra);
      })
    })
    /* let idSala = partido.id;
    this.storage.get('jugador').then((jugador) => {
      this.docSubscription = this.firebaseauthService
        .getDocumentById('Puentes', 'bridge-canchas')
        .subscribe((document: any) => {
          let puentes = document.canchasLP;
          puentes.forEach((idCancha) => {
            this.canchaSubscription = this.firebaseauthService
              .getDocumentById('CanchasLP', String(idCancha))
              .subscribe((canchaDocument: any) => {
                let cancha: Cancha = canchaDocument;
                cancha.salas.forEach((e) => {
                  if (e.id == idSala) {
                    this.storage.set('sala', {
                      id: e.id,
                      nombre: e.nombre,
                      hora: e.hora,
                      estado: e.estado,
                      slotsOcupados: e.slotsOcupados,
                      slotsTotales: e.slotsTotales,
                      sexo: e.sexo,
                      equipoRed: e.equipoRed,
                      equipoBlue: e.equipoBlue,
                    })
                    .then(() => {
                      this.storage.set('cancha', cancha)
                    })
                    .then(() => {
                      let canchaExtra: NavigationExtras = {
                        state: {
                          cancha: cancha,
                          partido: partido
                        },
                      };
                      this.router.navigate(['sala'], canchaExtra);
                    });
                  }
                });
                this.canchaSubscription.unsubscribe();
              });
          });
          this.docSubscription.unsubscribe();
        }); 
    });*/
  }

  ionViewWillEnter() {
    this.cargarPartidos();
  }
}