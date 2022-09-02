import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TablaColumnas } from '../models/tabla-columnas.model';

const base_url = `${environment.HOST}/api/columnas`;

@Injectable({
    providedIn: 'root'
})
export class TablaColumnasService {

    constructor(
        private http: HttpClient
    ) { }

    listar() {
        return this.http.get<TablaColumnas[]>(`${base_url}`);
    }

    listarPorTableName(tableName: string) {
        return this.http.get<TablaColumnas[]>(`${base_url}/tabla/${tableName}`);
    }

}