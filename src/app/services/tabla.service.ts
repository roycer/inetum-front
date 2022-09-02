import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tabla } from '../models/tabla.model';

const base_url = `${environment.HOST}/api/tablas`;

@Injectable({
    providedIn: 'root'
})
export class TablaService {

    constructor(
        private http: HttpClient
    ) { }

    listar() {
        return this.http.get<Tabla[]>(`${base_url}`);
    }

}