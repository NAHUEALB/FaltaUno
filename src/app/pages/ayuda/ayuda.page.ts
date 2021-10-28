import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss', '../../../global-modal-ayuda.scss'],
})
export class AyudaPage implements OnInit {

  @Input() enlaceMP: Response;


  constructor(private modalController: ModalController){  }
  cerrarModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ngOnInit() {
      console.log("El enlaceMP de pago es: "+ this.enlaceMP);
  }

}
