import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { SubModulo } from '../models/submodulo.model';

const base_url = `${environment.HOST}/api/submodulos`;

@Injectable({
    providedIn: 'root'
})
export class SubModuloService extends GenericService<SubModulo> {

    constructor(
        protected override http: HttpClient
    ) {
        super(
            http,
            `${base_url}`
        );
    }

    listarPorIdModulo(id: number) {
        return this.http.get<SubModulo[]>(`${this.url}/modulo/${id}`);
    }

    listarPorKeyModulo(key: string) {
        return this.http.get<SubModulo[]>(`${this.url}/modulo/k/${key}`);
    }

    listarPorKey(key: string) {
        return this.http.get<SubModulo>(`${this.url}/k/${key}`);
    }

}