import { Jugador } from './../models/jugador';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor(
	public auth: AngularFireAuth,          
	public fireStore: AngularFirestore,
	private storage: Storage) { }

  login(email, pass){
    return this.auth.signInWithEmailAndPassword(email,pass);
  }
  
  async loginGoogle() {
    try {
      return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider);
    } catch (err) {
      console.log("Detalles: " + err);
    }
  }

  registrar(email, pass){
    return this.auth.createUserWithEmailAndPassword(email,pass);
  }

  logout(){
	  this.storage.clear();
    this.auth.signOut();
  }
  
  createDocument<tipo>(data: tipo, link: string, id: string) {
		const ref = this.fireStore.collection<tipo>(link);
		return ref.doc(id).set(data);
	}

  getDocumentById(path,id){
    return this.fireStore.collection(path).doc(id).valueChanges();
  }

  getUserCurrent(){
    return this.auth.user;
  }

  updateDocument(path,data: Jugador){
    return this.fireStore.collection(path).doc(data.id).set({'nombre': data.nombre,
                                                                    'cvotos': data.cvotos,
                                                                    'fnacimiento': data.fnacimiento,
                                                                    'foto': data.foto,
                                                                    'id': data.id,
                                                                    'html': data.html,
                                                                    'puntaje': data.puntaje,
                                                                    'sexo': data.sexo,
                                                                    'perfil': data.perfil,
                                                                    'ubicacion': data.ubicacion,
                                                                    'usuario': data.usuario });
  }

}
