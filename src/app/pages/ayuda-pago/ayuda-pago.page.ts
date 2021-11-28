import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda-pago',
  templateUrl: './ayuda-pago.page.html',
  styleUrls: ['./ayuda-pago.page.scss', '../../../global-modal-ayuda.scss'],
})
export class AyudaPagoPage implements OnInit {

  constructor(private modalController: ModalController) { }
  cerrarModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnInit() {
  }

}
