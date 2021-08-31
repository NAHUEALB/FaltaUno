import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';

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


}
