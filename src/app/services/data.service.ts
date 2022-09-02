import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ControlData } from '../models/control-data.model';
import { Observable } from 'rxjs';

const base_url = `${environment.HOST}/api/data`;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  registrar(datos: ControlData[]): Observable<any> {
    return this.http.post(`${base_url}`, datos);
  }

  listarPorIdModulo(id: number) {
    return this.http.get<ControlData[]>(`${base_url}/modulo/${id}`);
  }

  listarPorKeyModulo(key: string) {
    return this.http.get<ControlData[]>(`${base_url}/modulo/k/${key}`);
  }

}
