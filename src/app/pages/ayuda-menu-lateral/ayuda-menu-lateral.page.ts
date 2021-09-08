import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda-menu-lateral',
  templateUrl: './ayuda-menu-lateral.page.html',
  styleUrls: ['./ayuda-menu-lateral.page.scss'],
})
export class AyudaMenuLateralPage implements OnInit {

  constructor(private modalController: ModalController) { }
  cerrarModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnInit() {
  }

}
