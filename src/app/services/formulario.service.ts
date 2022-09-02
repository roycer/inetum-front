import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormularioData } from '../models/formulario-data.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api/formulario`;

@Injectable({
    providedIn: 'root'
})
export class FormularioService {

    constructor(
        private http: HttpClient
    ) { }

    registrar(datos: FormularioData[]): Observable<any> {
        return this.http.post(`${base_url}`, datos);
    }

}