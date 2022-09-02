import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Modulo } from 'src/app/models/modulo.model';
import { ModuloService } from 'src/app/services/modulo.service';
import { Control } from 'src/app/models/control.model';
import { ControlService } from 'src/app/services/control.service';
import { OptionService } from 'src/app/services/option.service';
import { SelectData } from 'src/app/models/select-data.model';
import { SelectService } from 'src/app/services/select.service';
import { FormularioData } from 'src/app/models/formulario-data.model';
import { FormularioService } from 'src/app/services/formulario.service';
import * as moment from 'moment';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  public modulo: Modulo = new Modulo(null);
  public controles: Control[] | null = [];
  public keyModulo: string = '';
  public form: FormGroup = new FormGroup({});

  constructor(
    private _location: Location,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private moduloService: ModuloService,
    private controlService: ControlService,
    private opcionService: OptionService,
    private selectService: SelectService,
    private formularioService: FormularioService
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
        this.controles.map(control => {
          let idControl = (control.idControl) ? control.idControl : 0;
          this.opcionService.listarPorIdControl(idControl).subscribe(
            response => {
              let controlConOpciones = control;

              if (response && response.length > 0) {
                let tableName = response[0].tableName as string;
                let columnID = response[0].columnName as string;
                let columnValue = response[0].value as string;
                let selectData = new SelectData(tableName, columnID, columnValue);
                this.selectService.listar(selectData).subscribe(
                  response => {
                    let opciones = response;
                    controlConOpciones.opciones = opciones;
                  }
                );
              }

              return controlConOpciones;
            }
          );
        });
        this.form = this.toFormGroup(this.controles);
      }
    );
  }

  toFormGroup(controles: Control[]) {
    let regExCorreo = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
    let regExNumeroDNI = "[0-9]{8}$";

    const group: any = {};

    controles.forEach(control => {
      let clave = 'control-' + control.inputType + '-' + control.idControl;
      let obligatorio = (control.required == 1) ? true : false;

      if (obligatorio) {

        if (control.inputType == 'email') {
          group[clave] = new FormControl(control.value || '', [Validators.required, Validators.pattern(regExCorreo)]);
          return;
        }

        if (control.inputType == 'dni') {
          group[clave] = new FormControl(control.value || '', [Validators.required, Validators.pattern(regExNumeroDNI)]);
          return;
        }

        group[clave] = new FormControl(control.value || '', [Validators.required]);
      } else {

        if (control.inputType == 'email') {
          group[clave] = new FormControl(control.value || '', [Validators.pattern(regExCorreo)]);
          return;
        }

        if (control.inputType == 'dni') {
          group[clave] = new FormControl(control.value || '', [Validators.pattern(regExNumeroDNI)]);
          return;
        }

        group[clave] = new FormControl(control.value || '');
      }
    });
    return new FormGroup(group);
  }

  guardarDatos(myForm: FormGroupDirective) {
    let formulario = this.form.value;

    if (this.form.invalid) {
      this.snackBar.open(
        "Debe completar los datos obligatorios (*) para guardar",
        "AVISO",
        { duration: 2000 }
      );
      return;
    }

    let formularioData: FormularioData[] = [];
    for (let [clave, valor] of Object.entries(formulario)) {
      let arrayClave = clave.split("-");
      let idControl = parseInt(arrayClave[2]);
      let controles = this.controles?.filter((val) => val.idControl == idControl);
      let control = (controles) ? controles[0] : new Control(null);

      let value: any = '';
      if (valor) {
        value = valor;

        if (control.inputType == 'date') {
          value = moment(new Date(valor as Date)).format('DD/MM/YYYY');
        }
      }

      let formularioDataRegistro = new FormularioData(this.modulo, control, value as string);
      formularioData.push(formularioDataRegistro);
    }

    this.formularioService.registrar(formularioData).subscribe(
      response => {
        if (response) {
          this.snackBar.open(
            "Formulario registrado correctamente",
            "AVISO",
            { duration: 2000 }
          );
        } else {
          this.snackBar.open(
            "Error al registrar el formulario",
            "ERROR",
            { duration: 2000 }
          );
        }

        this.resetFormulario(myForm);
      }
    );
  }

  resetFormulario(myForm: FormGroupDirective) {
    myForm.resetForm();
    this.form.reset();
  }
}
