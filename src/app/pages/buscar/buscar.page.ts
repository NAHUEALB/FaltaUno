import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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
    public firebaseauthService: FirebaseauthService
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

  // mostrarMapa(partidoSeleccionado){
  // 	let canchaExtra : NavigationExtras = {
  // 		state: {
  // 			cancha: partidoSeleccionado
  // 		}
  // 	}
  // 	this.router.navigate(['mapa'], canchaExtra);
  // }

  irALaSala(partido) {
    console.log(partido);
    let idSala = partido.id;
    this.storage.get('jugador').then((jugador) => {
    //   let ciudadDelJugador = jugador.ubicacion;
	  let ciudadDelJugador = " La Plata ";
      this.docSubscription = this.firebaseauthService
        .getDocumentById('Puentes', 'bridge-canchas')
        .subscribe((document: any) => {
          let puentes;
          switch (ciudadDelJugador) {
            case ' La Plata ':
              puentes = document.canchasLP;
              break;
            case ' Berisso ':
              puentes = document.canchasBE;
              break;
            case ' Ensenada ':
              puentes = document.canchasEN;
              break;
            default:
              console.log('Error preguntando la ciudad del jugador');
              break;
          }

          puentes.forEach((idCancha) => {
            console.log(idCancha);
            this.canchaSubscription = this.firebaseauthService
              .getDocumentById('CanchasLP', String(idCancha))
              .subscribe((canchaDocument: any) => {
                let cancha: Cancha = canchaDocument;
                cancha.salas.forEach((e) => {
                  if (e.id == idSala) {
                    this.storage
                      .set('sala', {
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
                        // console.log(e);
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
    });
  }

  refresh() {
    this.storage.get('jugador').then((jugador) => {
    //   let ciudadDelJugador = jugador.ubicacion;
      let ciudadDelJugador = " La Plata ";

      this.docSubscription = this.firebaseauthService
        .getDocumentById('Puentes', 'bridge-canchas')
        .subscribe((document: any) => {
          let puentes;
          switch (ciudadDelJugador) {
            case ' La Plata ':
              puentes = document.canchasLP;
              break;
            case ' Berisso ':
              puentes = document.canchasBE;
              break;
            case ' Ensenada ':
              puentes = document.canchasEN;
              break;
            default:
              console.log('Error preguntando la ubicacion del jugador');
              break;
          }

          this.partidos = [];
          puentes.forEach((idCancha) => {
            this.canchaSubscription = this.firebaseauthService
              .getDocumentById('CanchasLP', String(idCancha))
              .subscribe((canchaDocument: any) => {
                let cancha: Cancha = canchaDocument;
                cancha.salas.forEach((p) => this.partidos.push(p));
                this.canchaSubscription.unsubscribe();

                this.partidos.forEach((unPartido) => {
                  this.setSexo(unPartido);
                  this.setColorSlot(unPartido);
                  this.setOrden(unPartido);
                });
                this.ordenarPartidos(this.partidos);
              });
          });

          this.docSubscription.unsubscribe();
        });
    });
  }

  ionViewWillEnter() {
    this.refresh();
  }
}
