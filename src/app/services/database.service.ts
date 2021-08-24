import { Injectable } from '@angular/core';
import { 
	AngularFirestore, 
	AngularFirestoreDocument, 
	AngularFirestoreCollection 
} from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})

export class DatabaseService {
	constructor (public Firestore: AngularFirestore) {

	}

	altaJugador<tipo>(data: tipo, enlace: string) {
		const ref = this.Firestore.collection(enlace);
		return ref.add(data);
	}

	bajaJugador() {

	}

	getJugador() {

	}

	editJugador() {

	}
	
}