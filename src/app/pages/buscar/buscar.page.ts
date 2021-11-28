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
  jugador
  partido

  partidosSql = []

  constructor(
    private router: Router,
    private storage: Storage,
    public firebaseauthService: FirebaseauthService,
    public http: HttpClient
  ) {
    this.storage.get('jugador')
    .then((jugador) => {
      this.jugador = jugador
      this.partido = {}
    })
    .catch(() => console.log("Primer error de querer cargar info del jugador desde el Storage"));
  }
    
  ngOnInit() {}
  
  ionViewWillEnter() {
    this.refreshPartidos();
  }

  irAlInicio() {
    this.storage.set("jugador", this.jugador)
    .then(() => this.storage.set("partido", this.partido)
      .then(() => this.storage.set("listaPartidos", this.partidosSql)
        .then(() => this.router.navigate([`/inicio`]))))
  }

  irALaSala(partido) {
    let requestSql = 'https://backend-f1-java.herokuapp.com/partidos/'+partido.idpartido
    fetch(requestSql)
    .then(res => res.json())
    .then(data => this.storage.set("jugador", this.jugador)
      .then(() => this.storage.set("partido", data)
        .then(() => this.router.navigate([`/sala`]))))
  }
  
  refreshPartidos() {
    let requestSql = 'https://backend-f1-java.herokuapp.com/partidos/'
    fetch(requestSql)
    .then(res => res.json())
    .then(data => {
      this.partidosSql = []
      data.forEach(p => {
        let ids = [p.idJug1, p.idJug2, p.idJug3, p.idJug4, p.idJug5, p.idJug6, p.idJug7, p.idJug8, p.idJug9, p.idJug10]
        let idsNoVacias = ids.filter(jid => jid !== 0)
        let nuevoPartido = {
          cancha: p.cancha,
          idpartido: p.idpartido,
          nombre: p.sala,
          estado: "Sala pública",
          slotsOcupados: idsNoVacias.length,
          slotsTotales: 10,
          sexo: p.sexo,
          hora: p.hora + ":00"
        }
        this.partidosSql.push(nuevoPartido)          
      });
      this.partidosSql.forEach(p => {
        this.setSexo(p);
        this.setColorSlot(p);
        this.setOrden(p);
      });
      this.ordenarPartidos(this.partidosSql);
    })
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
    let horaPartido = elem.hora.split(':')[0] - 0;
    let tiempo = Math.max(0, horaPartido/2);
    let slots = 2*(10 - elem.slotsOcupados);
    elem.orden = tiempo + slots;
  }

  ordenarPartidos(partidos) {
    partidos.sort((a, b) => a.orden - b.orden);
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
}