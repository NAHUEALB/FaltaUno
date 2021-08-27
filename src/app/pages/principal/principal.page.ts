import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { AyudaPage } from '../ayuda/ayuda.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  constructor(private menuCtrl: MenuController, private modalController: ModalController, private router: Router){}
  
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


  ionViewDidEnter(){
    this.menuCtrl.enable(false);
  }

  irAlCrear(){
    this.router.navigate([`/registrar`]);
  }
  login(){
    this.router.navigate([`/login`]);
  }

}


