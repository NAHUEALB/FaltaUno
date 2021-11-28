import { Jugador } from './../models/jugador';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
import firebase from 'firebase/app';
import { Sala } from '../models/sala';
import { Cancha } from '../models/cancha';
import { BridgeJugadores } from '../models/bridgeJugadores';

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
      console.error("Detalles: " + err);
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
    return this.fireStore.collection(path).doc(data.id).set({
      'nombre': data.nombre,
      'cantidad_votos': data.cantidad_votos,
      'fnacimiento': data.fnacimiento,
      'foto': data.foto,
      'id': data.id,
      'html': data.html,
      'puntaje': data.puntaje,
      'sexo': data.sexo,
      'perfil': data.perfil,
      'ubicacion': data.ubicacion,
    });
  }

  updateSala(path,data: Sala){
    return this.fireStore.collection(path).doc(data.id).set({
      'id': data.id,
      'nombre': data.nombre,
      'sexo': data.sexo,
      'estado': data.estado 
    });
  }

  updateCancha(path,data: Cancha) {
    return this.fireStore.collection(path).doc(String(data.id)).set({
      'id': String(data.id),
      'nombre': data.nombre,
      'direccion': data.direccion,
      'lat': data.lat,
      'lon' : data.lon,
      'precio' : data.precio,
      'salas' : data.salas
    });
  }

  updateBridgeJugadores(data: BridgeJugadores){
    return this.fireStore.collection('Puentes').doc('bridge-jugadores').set({
      'id': data.id,
      'jugadores': data.jugadores,
    });
  }
}
