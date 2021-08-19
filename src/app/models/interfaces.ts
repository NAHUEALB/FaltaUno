export interface Jugador {
	nombre: string; // validar que no tenga insultos (?
	usuario: string; // se almacena sin el "@"
	fnacimiento: string; // debe ser compatible con el timestamp de Firebase
	puntaje: number; // acumulador para los votos
	cvotos: number; // contador de votos totales
	sexo: string;
	perfil: boolean; // true: Público; false: Privado (sugerir nombre más descriptivo)
	foto: string; // guarda link?
	ubicacion: string;
}