import { Sala } from "./sala";

export class Cancha {
    id: string;
    nombre: string;
    direccion: string;
    lat: number;
    lon: number;
    precio: number;
    salas: Sala[] = [];
}