import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Modulo } from 'src/app/models/modulo.model';
import { ModuloService } from 'src/app/services/modulo.service';
import { Control } from 'src/app/models/control.model';
import { ControlService } from 'src/app/services/control.service';
import { OptionService } from 'src/app/services/option.service';
import { ControlData } from 'src/app/models/control-data.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  public modulo: Modulo = new Modulo(null);
  public controles: Control[] | null = [];
  public controlesData: ControlData[] | null = [];
  public keyModulo: string = '-';
  public keysData: any = [];

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private moduloService: ModuloService,
    private controlService: ControlService,
    private optionService: OptionService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.configPagina();
  }

  backClicked() {
    this._location.back();
  }

  configPagina() {
    this.route.params.subscribe((params: Params) => {
      if (params['key'] != null) {
        this.keyModulo = params['key'];
        this.cargarModulo();
        this.cargarControlesModulo();
        this.cargarDataControlesModulo();
      }
    });
  }

  cargarModulo() {
    this.moduloService.listarPorKey(this.keyModulo).subscribe(
      response => {
        this.modulo = response;
      },
      error => {
        console.log(error);
        this.router.navigate(['panel/home']);
      }
    );
  }

  cargarControlesModulo() {
    this.controlService.listarPorKeyModulo(this.keyModulo).subscribe(
      response => {
        this.controles = response;
      }
    );
  }

  cargarDataControlesModulo() {
    this.dataService.listarPorKeyModulo(this.keyModulo).subscribe(
      response => {
        this.controlesData = response;
        this.generarKeysData(this.controlesData);

        this.controlesData.map(controlData => {
          let controlConOpciones = controlData;
          let control = controlData.control;
          if (control?.controlType == 'select') {
            let idOption = parseInt(controlData.value as string);
            this.optionService.listarPorId(idOption).subscribe(
              response => {
                let valorOption = response;
                controlConOpciones.value = (response) ? valorOption.value : '-';
                return controlConOpciones;
              }
            );
          }
          return controlConOpciones;
        });
      }
    );
  }

  generarKeysData(controlesData: ControlData[]) {
    let arrayKeys: any[] = [];
    controlesData.forEach((valor, index) => {
      let key = (valor.key) ? valor.key : '-';
      let existe = arrayKeys.filter(valor => valor.key == key);
      if (existe.length == 0) {
        let objeto = { 'id': index + 1, 'key': key };
        arrayKeys.push(objeto);
      }

      arrayKeys.map((valor, index) => {
        let valorOrdenado = valor;
        valorOrdenado.id = index;
        return valorOrdenado;
      });
    });

    this.keysData = arrayKeys;
  }

  getDataColumna(key: string, idControl: number) {
    let busqueda = this.controlesData?.filter(valor => valor.key == key && valor.control?.idControl == idControl);
    if (busqueda && busqueda.length > 0) {
      let valorColumna = (busqueda[0].value) ? busqueda[0].value : '-';
      return valorColumna;
    }
    return '-';
  }

}
