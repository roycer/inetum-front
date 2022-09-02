import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Modulo } from '../models/modulo.model';

const base_url = `${environment.HOST}/api/modulos`;

@Injectable({
  providedIn: 'root'
})
export class ModuloService extends GenericService<Modulo> {

  constructor(
    protected override http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }

  listarPorKey(key: string) {
    return this.http.get<Modulo>(`${this.url}/k/${key}`);
  }

}
