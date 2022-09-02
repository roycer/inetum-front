import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { Control } from '../models/control.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api/controles`;

@Injectable({
  providedIn: 'root'
})
export class ControlService extends GenericService<Control> {

  constructor(
    protected override http: HttpClient
  ) {
    super(
      http,
      `${base_url}`
    );
  }

  actualizarListado(datos: Control[]): Observable<any> {
    return this.http.put(`${this.url}/actualizar/listado`, datos);
  }

  listarPorIdModulo(id: number) {
    return this.http.get<Control[]>(`${this.url}/modulo/${id}`);
  }

  listarPorKeyModulo(key: string) {
    return this.http.get<Control[]>(`${this.url}/modulo/k/${key}`);
  }

  listarPorKey(key: string) {
    return this.http.get<Control>(`${this.url}/k/${key}`);
  }

}
