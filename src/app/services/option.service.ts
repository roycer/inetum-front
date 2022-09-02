import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { ControlOption } from '../models/control-option.model';

const base_url = `${environment.HOST}/api/opciones`;

@Injectable({
    providedIn: 'root'
})
export class OptionService extends GenericService<ControlOption> {

    constructor(
        protected override http: HttpClient
    ) {
        super(
            http,
            `${base_url}`
        );
    }

    listarPorIdControl(id: number) {
        return this.http.get<ControlOption[]>(`${this.url}/control/${id}`);
    }

    listarPorKeyControl(key: string) {
        return this.http.get<ControlOption[]>(`${this.url}/control/k/${key}`);
    }

    listarPorKey(key: string) {
        return this.http.get<ControlOption>(`${this.url}/k/${key}`);
    }

}
