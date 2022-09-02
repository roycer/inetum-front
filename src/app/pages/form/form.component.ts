import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Modulo } from 'src/app/models/modulo.model';
import { ModuloService } from 'src/app/services/modulo.service';
import { Control, option } from 'src/app/models/control.model';
import { ControlService } from 'src/app/services/control.service';
import { TablaColumnas } from 'src/app/models/tabla-columnas.model';
import { TablaColumnasService } from 'src/app/services/tabla-columnas.service';
import { DialogAlertComponent } from '../dialog/alert/dialog-alert.component';
import { DialogControlComponent } from '../dialog/control/dialog-control.component';
import { DialogOptionComponent } from '../dialog/option/dialog-option.component';
import * as moment from 'moment';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public formConfig: FormGroup = new FormGroup({});
  public modulo: Modulo = new Modulo(null);
  public controles: Control[] = [];
  public keyModulo: string = '';
  public listaControles: option[] = [];
  public listaTipos: option[] = [];
  public listaTiposGrid: option[] = [];
  public listaColumnas: TablaColumnas[] = [];

  @ViewChild('dataTable') table!: MatTable<Control>;
  public displayedColumns: string[] = ['descripcion', 'columna', 'tipoControl', 'tipoDato', 'obligatorio', 'opciones', 'acciones'];
  public dataSource!: MatTableDataSource<Control>;

  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private moduloService: ModuloService,
    private controlService: ControlService,
    private tablaColumnasService: TablaColumnasService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.configPagina();
  }

  backClicked() {
    this._location.back();
  }

  dropTable(event: CdkDragDrop<Control[]>): void {
    moveItemInArray(this.controles, event.previousIndex, event.currentIndex);
    this.table.renderRows();

    let controlesOrdenados = this.controles.map((control, index) => {
      let controlOrdenado = control;
      controlOrdenado.order = index + 1;
      return controlOrdenado;
    });

    this.controlService.actualizarListado(controlesOrdenados).subscribe();
  }

  configPagina() {
    this.route.params.subscribe((params: Params) => {
      if (params['key'] != null) {
        this.keyModulo = params['key'];
        this.cargarModulo();
        this.cargarControlesModulo();
        this.cargarListaControles();
        this.cargarListaTiposGrid();
      }
    });
  }

  crearFormulario() {
    this.formConfig = this.fb.group({
      label: ['', [Validators.required]],
      controlType: ['', [Validators.required]],
      inputType: ['', [Validators.required]],
      gridClass: ['', [Validators.required]],
      columnName: ['', [Validators.required]],
      required: ['1'],
    });
  }

  cargarModulo() {
    this.moduloService.listarPorKey(this.keyModulo).subscribe(
      response => {
        this.modulo = response;
        this.cargarListaColumnas(this.modulo.tableName as string);
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
        this.dataSource = new MatTableDataSource(this.controles);
      }
    );
  }

  cargarListaColumnas(tableName: string) {
    this.tablaColumnasService.listarPorTableName(tableName).subscribe(
      response => {
        this.listaColumnas = response;
      }
    );
  }

  cargarListaControles() {
    this.listaControles = [
      { 'key': 'input', 'value': 'Campo Simple' },
      { 'key': 'textarea', 'value': 'Área de Texto' },
      { 'key': 'select', 'value': 'Lista de Opciones' },
    ];
  }

  changeTipoControl() {
    let formulario = this.formConfig.value;
    if (formulario.controlType == 'input') {
      this.cargarListaTipos();
      this.formConfig.get("inputType")?.setValue('');
      return;
    }

    if (formulario.controlType == 'textarea') {
      this.listaTipos = [
        { 'key': 'text', 'value': 'Texto' },
      ];
      this.formConfig.get("inputType")?.setValue('text');
      return;
    }

    if (formulario.controlType == 'select') {
      this.listaTipos = [
        { 'key': 'option', 'value': 'Opción' },
      ];
      this.formConfig.get("inputType")?.setValue('option');
      return;
    }
  }

  cargarListaTipos() {
    this.listaTipos = [
      { 'key': 'text', 'value': 'Texto' },
      { 'key': 'number', 'value': 'Número' },
      { 'key': 'email', 'value': 'Correo' },
      { 'key': 'date', 'value': 'Fecha' },
      { 'key': 'dni', 'value': 'DNI' },
    ];
  }

  cargarListaTiposGrid() {
    this.listaTiposGrid = [
      { 'key': 'col-md-12', 'value': 'Grid 1/1 Columnas' },
      { 'key': 'col-md-6', 'value': 'Grid 1/2 Columnas' },
      { 'key': 'col-md-4', 'value': 'Grid 1/3 Columnas' },
      { 'key': 'col-md-3', 'value': 'Grid 1/4 Columnas' },
    ];
  }

  guardarDatos(configForm: FormGroupDirective) {
    let formulario = this.formConfig.value;

    if (this.formConfig.invalid) {
      this.snackBar.open(
        "Debe completar los datos obligatorios (*) para guardar",
        "AVISO",
        { duration: 2000 }
      );
      return;
    }

    let control = new Control(null);
    control.modulo = this.modulo;
    control.key = this.generateUUID();
    control.label = formulario.label;
    control.required = parseInt(formulario.required);
    control.controlType = formulario.controlType;
    control.inputType = formulario.inputType;
    control.gridClass = formulario.gridClass;
    control.columnName = formulario.columnName;
    control.estadoReg = 1;
    control.fechaReg = moment(new Date()).format('DD/MM/YYYY');

    this.controlService.registrar(control).subscribe(
      response => {
        if (response) {
          this.snackBar.open(
            "Control registrado correctamente",
            "AVISO",
            { duration: 2000 }
          );
        }

        this.resetFormulario(configForm);
        this.cargarControlesModulo();
      }
    );
  }

  resetFormulario(configForm: FormGroupDirective) {
    configForm.resetForm();
    this.formConfig.reset();
    this.formConfig.get("required")?.setValue('1');
    this.listaTipos = [];
  }

  mostrarDialogOption(control: Control) {
    this.dialog.open(DialogOptionComponent, {
      disableClose: true,
      data: {
        titulo: "Configuración de Opciones",
        control: control,
      },
    });
  }

  mostrarDialogEditar(control: Control) {
    const editarDialog = this.dialog.open(DialogControlComponent, {
      disableClose: true,
      data: {
        titulo: "Editar Control",
        control: control,
      },
    });
    editarDialog.afterClosed().subscribe((result: Control) => {
      if (result) {
        let editarControl = result;
        this.controlService.modificar(editarControl).subscribe(response => {
          if (response) {
            this.cargarControlesModulo();
            this.snackBar.open(
              "Control editado correctamente",
              "AVISO",
              { duration: 2000 }
            );
          }
        });
      }
    });
  }

  eliminarControl(control: Control) {
    const confirmDialog = this.dialog.open(DialogAlertComponent, {
      disableClose: true,
      data: {
        titulo: "Alerta",
        mensaje: "Deseas eliminar el registro seleccionado?",
      },
    });
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result === true) {
        let eliminarControl = control;
        let idControl = (eliminarControl.idControl) ? eliminarControl.idControl : 0;
        this.controlService.eliminar(idControl).subscribe(response => {
          if (response) {
            this.cargarControlesModulo();
            this.snackBar.open(
              "Control eliminado correctamente",
              "AVISO",
              { duration: 2000 }
            );
          }
        });
      }
    });
  }

  generateUUID() {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }
}
