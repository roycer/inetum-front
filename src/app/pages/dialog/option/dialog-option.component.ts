import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Control } from "src/app/models/control.model";
import { ControlOption } from "src/app/models/control-option.model";
import { OptionService } from "src/app/services/option.service";
import { Tabla } from "src/app/models/tabla.model";
import { TablaService } from "src/app/services/tabla.service";
import { TablaColumnas } from "src/app/models/tabla-columnas.model";
import { TablaColumnasService } from "src/app/services/tabla-columnas.service";
import * as moment from 'moment';

@Component({
  selector: "app-dialog-option",
  templateUrl: "./dialog-option.component.html",
  styleUrls: ["./dialog-option.component.css"],
})
export class DialogOptionComponent implements OnInit {

  public formOption: FormGroup = new FormGroup({});
  public control: Control = new Control(null);
  public controlOption: ControlOption = new ControlOption(null);
  public edicion: boolean = false;
  public titulo: string = '';
  public listaOpciones: ControlOption[] = [];
  public listaTablas: Tabla[] = [];
  public listaColumnasId: TablaColumnas[] = [];
  public listaColumnasValue: TablaColumnas[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private optionService: OptionService,
    private tablaService: TablaService,
    private tablaColumnasService: TablaColumnasService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.control = this.data.control;
    this.cargarOpcionesControl();
    this.cargarListaTablas();
  }

  crearFormulario() {
    this.formOption = this.fb.group({
      label: ["", Validators.required],
      tableName: ["", Validators.required],
      columnName: ["", Validators.required],
    });
  }

  cargarListaTablas() {
    this.tablaService.listar().subscribe(
      response => {
        this.listaTablas = response;
      }
    );
  }

  changeTableName() {
    let formulario = this.formOption.value;
    this.cargarListaColumnas(formulario.tableName);
  }

  cargarListaColumnas(tableName: string) {
    this.tablaColumnasService.listarPorTableName(tableName).subscribe(
      response => {
        this.listaColumnasId = response;
        this.listaColumnasValue = response;
      }
    );
  }

  cargarOpcionesControl() {
    this.optionService.listarPorKeyControl(this.control.key as string).subscribe(
      response => {
        this.listaOpciones = response;
        if (this.listaOpciones.length > 0) {
          this.edicion = true;

          let tableName = this.listaOpciones[0].tableName as string;
          this.cargarListaColumnas(tableName);

          this.formOption.reset({
            label: this.listaOpciones[0].value,
            tableName: this.listaOpciones[0].tableName,
            columnName: this.listaOpciones[0].columnName,
          });

          this.formOption.get("label")?.disable();
          this.formOption.get("tableName")?.disable();
          this.formOption.get("columnName")?.disable();
        }
      }
    );
  }

  guardarOpcion() {
    let formulario = this.formOption.value;
    if (this.formOption.invalid) {
      this.snackBar.open(
        "Debe completar los datos obligatorios(*) para guardar",
        "AVISO",
        { duration: 2000 }
      );
    } else {
      let controlOption = new ControlOption(null);
      controlOption.control = this.control;
      controlOption.key = this.generateUUID();
      controlOption.value = formulario.label;
      controlOption.tableName = formulario.tableName;
      controlOption.columnName = formulario.columnName;
      controlOption.estadoReg = 1;
      controlOption.fechaReg = moment(new Date()).format('DD/MM/YYYY');

      if (!this.edicion) {
        this.optionService.registrar(controlOption).subscribe(response => {
          if (response) {
            this.snackBar.open(
              "Configuración guardada correctamente",
              "AVISO",
              { duration: 2000 }
            );
          }
        });
      }

      this.dialogRef.close(controlOption);
    }
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
