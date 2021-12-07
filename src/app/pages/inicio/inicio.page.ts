import { FirebaseauthService } from './../../serv/firebaseauth.service';
import { ModalController, MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Jugador } from 'src/app/models/jugador';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

import { AyudaPage } from '../ayuda/ayuda.page';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  docSubscription;
  usuarioSubscription;

  enlace = 'Jugador';
  jugador = {
    id: '',
    id_firebase: '',
    nombre: '',
    password: '',
    email: '',
    fnacimiento: '',
    puntaje: 0,
    cantidad_votos: 0,
    sexo: '',
    perfil: false,
    ubicacion: ' La Plata ',
    pagado: 0,
  };

  enlaceNoticia = 'Noticia';
  indexNumerador = 1;
  mostrarNoticias = false;
  delayEntreNoticias = 12000;

  partidos = [
    {
      nombre: 'Megastadio',
      cancha: {
        direccion: 'Calle 1 y 64',
        nombreCancha: 'Megastadio',
      },
      slotsOcupados: 7,
      slotsTotales: 10,
      hora: '12:00',
      sexo: ' Masculino ',
    },
    {
      nombre: 'Estadio 7',
      cancha: {
        direccion: 'Calle 6 y 59',
        nombreCancha: 'Estadio 7',
      },
      slotsOcupados: 6,
      slotsTotales: 10,
      hora: '17:00',
      sexo: ' Mixto ',
    },
  ];

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private storage: Storage,
    public toastController: ToastController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.mostrarNoticias = true;
    this.partidos.forEach((p) => {
      this.setSexo(p);
      this.setColorSlot(p);
    });
  }

  irAlHistorial() {
    this.storage
      .set('jugador', this.jugador)
      .then(() => this.router.navigate([`/historial`]));
  }

  irAlPerfil() {
    console.log('QUE TENGA id_firebase:', this.jugador);
    this.storage
      .set('jugador', this.jugador)
      .then(() => this.router.navigate([`/perfil`]));
  }

  irAlBuscar() {
    this.storage
      .set('jugador', this.jugador)
      .then(() => setTimeout(() => this.router.navigate([`/buscar`]), 100));
  }

  ionViewWillEnter() {
    this.mostrarNoticias = true;
    this.menuCtrl.enable(true);

    this.nextNoticia();

    this.storage
      .get('jugador')
      .then((jugador) => {
        this.jugador = jugador;
        !this.jugador.nombre && this.actualizarJugadorPorIdFirebase();
        this.storage
          .get('listaPartidos')
          .then((lista) => {
            if (lista) {
              if (lista[0]) this.partidos[0] = lista[0];
              if (lista[1]) this.partidos[1] = lista[1];
            }
          })
          .catch((err) =>
            console.error('no existe lista de partidos aun', err)
          );
      })
      .catch(() => {
        console.error(
          'Primer error de querer cargar info del jugador desde el Storage'
        );
      });
  }

  ionViewWillLeave() {
    this.jugador.nombre = '';
    this.mostrarNoticias = false;
  }

  actualizarJugadorPorIdFirebase() {
    let requestSql =
      'https://backend-f1-java.herokuapp.com/jugadores/firebase/' +
      this.jugador.id_firebase;
    fetch(requestSql)
      .then((res) => res.json())
      .then((data) => {
        this.jugador.id = data.idjugador;
        this.jugador.password = data.password;
        this.jugador.nombre = data.nombre;
        this.jugador.sexo = data.sexo;
        this.jugador.fnacimiento = data.fnacimiento;
        this.jugador.cantidad_votos = data.cantVotos;
        this.jugador.puntaje = data.puntaje;
        console.log('QUE TENGA id_firebase:', this.jugador);
      })
      .catch(() =>
        this.presentToast(
          '💀 Hubo un problema recuperando al jugador de Firebase',
          2000
        )
      );
  }

  nextNoticia() {
    let oldSlider = document.getElementById('slide' + this.indexNumerador);
    let oldNumerador = document.getElementById(
      'numerador' + this.indexNumerador
    );

    this.indexNumerador++;
    if (this.indexNumerador == 4) this.indexNumerador = 1;

    let newSlider = document.getElementById('slide' + this.indexNumerador);
    let newNumerador = document.getElementById(
      'numerador' + this.indexNumerador
    );

    setTimeout(() => {
      oldSlider.style.opacity = '0';
      newSlider.style.opacity = '1';
      oldNumerador.style.color = 'white';
      newNumerador.style.color = 'orangered';
      if (this.mostrarNoticias) this.nextNoticia();
    }, this.delayEntreNoticias);
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

  async abrirModal() {
    const modal = await this.modalController.create({
      component: AyudaPage,
      cssClass: 'modal-css',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });
    await modal.present();
  }

  async presentToast(msg: string, time: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
    });
    toast.present();
  }
}
