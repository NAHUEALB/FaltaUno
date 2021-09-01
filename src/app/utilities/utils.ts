import { LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})

export class Utilities{
    
    public static async presentLoading(loadingController: LoadingController, msj: string, ) {
        const loading = await loadingController.create({
            cssClass: 'my-custom-class',
            message: msj,
        });
        await loading.present();
    
        // const {data } = await loading.onDidDismiss();
        // console.log('Loading dismissed!');
    }

}

