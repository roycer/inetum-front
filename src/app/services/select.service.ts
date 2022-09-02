import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SelectData } from '../models/select-data.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api/select`;

@Injectable({
    providedIn: 'root'
})
export class SelectService {

    constructor(
        private http: HttpClient
    ) { }

    listar(datos: SelectData): Observable<any> {
        return this.http.post(`${base_url}`, datos);
    }

}