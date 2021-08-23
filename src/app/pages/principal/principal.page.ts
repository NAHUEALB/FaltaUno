import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AyudaPage } from '../ayuda/ayuda.page';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  constructor(private modalController: ModalController){}
  async abrirModal() {
    const modal = await this.modalController.create({
      component: AyudaPage
    });
    await modal.present();
    let {data}= await modal.onDidDismiss();
    if(data.dismissed){
      console.log("cerrarModal");
    }
  }

  ngOnInit() {
  }

}


