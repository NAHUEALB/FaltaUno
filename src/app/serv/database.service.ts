import { Injectable } from "@angular/core";
import { 
	AngularFirestore, 
	AngularFirestoreDocument, 
	AngularFirestoreCollection 
} from "@angular/fire/firestore";

@Injectable({
	providedIn: 'root'
})

// Empezamos a usar la base de datos de Firebase
export class DatabaseService {

	constructor(public FireStore: AngularFirestore) {

	}

	createDocument<tipo>(data: tipo, link: string) {
		const ref = this.FireStore.collection<tipo>(link);
		return ref.add(data);
	}
	
	createId() {
		return this.FireStore.createId();
	}

	updateDocument<tipo>() {
	
	}

	deleteDocument<tipo>() {

	}

	getDocument<tipo>() {

	}
}