import { Usuario } from 'src/app/models/usuario';
import { Jugador } from 'src/app/models/jugador';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor(public auth: AngularFireAuth,
              public fireStore: AngularFirestore) { }

  login(email, pass){
    return this.auth.signInWithEmailAndPassword(email,pass);
  }

  registrar(email, pass){
    console.log(email);
    console.log(pass);
    return this.auth.createUserWithEmailAndPassword(email,pass);
  }

  logout(){
    this.auth.signOut();
  }

  //Cargo el usuario en el cloud storage

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.uid}`);
    const userData: Usuario = {
      id: user.uid,
      nombre: user.nombre,
      nomUsuario: user.nomUsuario,
      fnacimiento: user.fnacimiento,
      puntajeTotal: user.puntajeTotal,
      votosTotal: user.votosTotal,
      sexo: user.sexo,
      perfil: user.perfil,
      foto: user.foto,
      ubicacion: user.ubicacion
    }
    return userRef.set(userData, {
      merge: true
    })
  }
 


}
