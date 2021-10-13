import { Jugador } from "./jugador";

export class Sala {
    id: string;
    nombre: string;
    sexo: string;
    estado: string;
    slotsOcupados: number;
	slotsTotales: number;
    hora: string;
    equipoRed: Jugador[] = [];
    equipoBlue: Jugador[] = [];
}