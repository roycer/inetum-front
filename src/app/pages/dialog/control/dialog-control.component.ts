import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Control, option } from "src/app/models/control.model";

@Component({
  selector: "app-dialog-control",
  templateUrl: "./dialog-control.component.html",
  styleUrls: ["./dialog-control.component.css"],
})
export class DialogControlComponent implements OnInit {

  public formControl: FormGroup = new FormGroup({});
  public control: Control = new Control(null);
  public edicion: boolean = false;
  public titulo: string = '';
  public listaTiposGrid: option[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogControlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.titulo = this.data.titulo;
    this.control = this.data.control;
    if (this.control.idControl) {
      this.edicion = true;
      this.cargarListaTiposGrid();
      this.cargarDataControl();
    }
  }

  crearFormulario() {
    this.formControl = this.fb.group({
      label: ["", Validators.required],
      gridClass: ["", Validators.required],
    });
  }

  cargarListaTiposGrid() {
    this.listaTiposGrid = [
      { 'key': 'col-md-12', 'value': 'Grid 1/1 Columnas' },
      { 'key': 'col-md-6', 'value': 'Grid 1/2 Columnas' },
      { 'key': 'col-md-4', 'value': 'Grid 1/3 Columnas' },
      { 'key': 'col-md-3', 'value': 'Grid 1/4 Columnas' },
    ];
  }

  cargarDataControl() {
    this.formControl.reset({
      label: this.control.label,
      gridClass: this.control.gridClass
    });
  }

  agregarControl() {
    let formulario = this.formControl.value;
    if (this.formControl.invalid) {
      this.snackBar.open(
        "Debe completar los datos obligatorios(*) para guardar",
        "AVISO",
        { duration: 2000 }
      );
    } else {
      let control = this.edicion ? this.control : new Control(null);
      control.label = formulario.label;
      control.gridClass = formulario.gridClass;

      this.dialogRef.close(control);
    }
  }
}
