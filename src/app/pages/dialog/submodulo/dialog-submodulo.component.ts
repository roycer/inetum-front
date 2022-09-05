import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Modulo } from "src/app/models/modulo.model";
import { SubModulo } from "src/app/models/submodulo.model";
import { Tabla } from "src/app/models/tabla.model";
import { TablaService } from "src/app/services/tabla.service";
import { TablaColumnas } from "src/app/models/tabla-columnas.model";
import { TablaColumnasService } from "src/app/services/tabla-columnas.service";
import * as moment from 'moment';

@Component({
  selector: "app-dialog-submodulo",
  templateUrl: "./dialog-submodulo.component.html",
  styleUrls: ["./dialog-submodulo.component.css"],
})
export class DialogSubModuloComponent implements OnInit {

  public formSubModulo: FormGroup = new FormGroup({});
  public modulo: Modulo = new Modulo(null);
  public submodulo: SubModulo = new SubModulo(null);
  public edicion: boolean = false;
  public titulo: string = '';
  public listaTablas: Tabla[] = [];
  public listaColumnas: TablaColumnas[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogSubModuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tablaService: TablaService,
    private tablaColumnasService: TablaColumnasService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.modulo = this.data.modulo;
    this.submodulo = this.data.submodulo;
    this.cargarListaTablas();
    if (this.submodulo.idSubModulo) {
      this.edicion = true;
      this.cargarDataSubModulo();
    }
  }

  crearFormulario() {
    this.formSubModulo = this.fb.group({
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
    let formulario = this.formSubModulo.value;
    this.cargarListaColumnas(formulario.tableName);
  }

  cargarListaColumnas(tableName: string) {
    this.tablaColumnasService.listarPorTableName(tableName).subscribe(
      response => {
        this.listaColumnas = response;
      }
    );
  }

  cargarDataSubModulo() {
    let tableName = this.submodulo.tableName as string;;
    this.cargarListaColumnas(tableName);

    if (this.edicion) {
      this.formSubModulo.reset({
        label: this.submodulo.label,
        tableName: this.submodulo.tableName,
        columnName: this.submodulo.columnName,
      });

      this.formSubModulo.get("tableName")?.disable();
      this.formSubModulo.get("columnName")?.disable();
    }
  }

  agregarSubModulo() {
    let formulario = this.formSubModulo.value;
    if (this.formSubModulo.invalid) {
      this.snackBar.open(
        "Debe completar los datos obligatorios(*) para guardar",
        "AVISO",
        { duration: 2000 }
      );
    } else {
      let submodulo = this.edicion ? this.submodulo : new SubModulo(null);
      submodulo.label = formulario.label;

      if (!this.edicion) {
        submodulo.modulo = this.modulo;
        submodulo.key = this.generateUUID();
        submodulo.tableName = formulario.tableName;
        submodulo.columnName = formulario.columnName;
        submodulo.estadoReg = 1;
        submodulo.fechaReg = moment(new Date()).format('DD/MM/YYYY');
      }

      this.dialogRef.close(submodulo);
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
