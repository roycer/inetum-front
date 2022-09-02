import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Modulo } from "src/app/models/modulo.model";
import { Tabla } from "src/app/models/tabla.model";
import { TablaService } from "src/app/services/tabla.service";
import * as moment from 'moment';

@Component({
  selector: "app-dialog-modulo",
  templateUrl: "./dialog-modulo.component.html",
  styleUrls: ["./dialog-modulo.component.css"],
})
export class DialogModuloComponent implements OnInit {

  public formModulo: FormGroup = new FormGroup({});
  public modulo: Modulo = new Modulo(null);
  public edicion: boolean = false;
  public titulo: string = '';
  public listaTablas: Tabla[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogModuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tablaService: TablaService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.modulo = this.data.modulo;
    this.cargarListaTablas();
    if (this.modulo.idModulo) {
      this.edicion = true;
      this.cargarDataModulo();
    }
  }

  crearFormulario() {
    this.formModulo = this.fb.group({
      label: ["", Validators.required],
      tableName: ["", Validators.required],
    });
  }

  cargarListaTablas() {
    this.tablaService.listar().subscribe(
      response => {
        this.listaTablas = response;
      }
    );
  }

  cargarDataModulo() {
    this.formModulo.reset({
      label: this.modulo.label,
      tableName: this.modulo.tableName,
    });

    if (this.edicion) {
      this.formModulo.get("tableName")?.disable();
    }
  }

  agregarModulo() {
    let formulario = this.formModulo.value;
    if (this.formModulo.invalid) {
      this.snackBar.open(
        "Debe completar los datos obligatorios(*) para guardar",
        "AVISO",
        { duration: 2000 }
      );
    } else {
      let modulo = this.edicion ? this.modulo : new Modulo(null);
      modulo.label = formulario.label;

      if (!this.edicion) {
        modulo.key = this.generateUUID();
        modulo.tableName = formulario.tableName;
        modulo.estadoReg = 1;
        modulo.fechaReg = moment(new Date()).format('DD/MM/YYYY');
      }

      this.dialogRef.close(modulo);
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
