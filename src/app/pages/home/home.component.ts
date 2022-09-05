import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Modulo } from 'src/app/models/modulo.model';
import { ModuloService } from 'src/app/services/modulo.service';
import { DialogAlertComponent } from '../dialog/alert/dialog-alert.component';
import { DialogModuloComponent } from '../dialog/modulo/dialog-modulo.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public modulo: Modulo = new Modulo(null);
  public modulos: Modulo[] = [];
  public displayedColumns: string[] = ['label', 'tableName', 'formulario', 'acciones'];
  public dataSource!: MatTableDataSource<Modulo>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    this.cargarDataModulos();
  }

  cargarDataModulos() {
    this.moduloService.listar().subscribe(
      (response) => {
        this.modulos = response;
        this.dataSource = new MatTableDataSource(this.modulos);
      }
    );
  }

  mostrarDialogAgregar() {
    const agregarDialog = this.dialog.open(DialogModuloComponent, {
      disableClose: true,
      data: {
        titulo: "Crear Módulo",
        modulo: this.modulo,
      },
    });
    agregarDialog.afterClosed().subscribe((result: Modulo) => {
      if (result) {
        let nuevoModulo = result;
        this.moduloService.registrar(nuevoModulo).subscribe(response => {
          if (response) {
            this.cargarDataModulos();
            this.snackBar.open(
              "Módulo registrado correctamente",
              "AVISO",
              { duration: 2000 }
            );
          }
        });
      }
    });
  }

  mostrarDialogEditar(modulo: Modulo) {
    const editarDialog = this.dialog.open(DialogModuloComponent, {
      disableClose: true,
      data: {
        titulo: "Editar Módulo",
        modulo: modulo,
      },
    });
    editarDialog.afterClosed().subscribe((result: Modulo) => {
      if (result) {
        let editarModulo = result;
        this.moduloService.modificar(editarModulo).subscribe(response => {
          if (response) {
            this.cargarDataModulos();
            this.snackBar.open(
              "Módulo editado correctamente",
              "AVISO",
              { duration: 2000 }
            );
          }
        });
      }
    });
  }

  eliminarModulo(modulo: Modulo) {
    const confirmDialog = this.dialog.open(DialogAlertComponent, {
      disableClose: true,
      data: {
        titulo: "Alerta",
        mensaje: "Deseas eliminar el registro seleccionado?",
      },
    });
    confirmDialog.afterClosed().subscribe((result: any) => {
      if (result === true) {
        let eliminarModulo = modulo;
        let idModulo = (eliminarModulo.idModulo) ? eliminarModulo.idModulo : 0;
        this.moduloService.eliminar(idModulo).subscribe(response => {
          if (response) {
            this.cargarDataModulos();
            this.snackBar.open(
              "Módulo eliminado correctamente",
              "AVISO",
              { duration: 2000 }
            );
          }
        });
      }
    });
  }
}
