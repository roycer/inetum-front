import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material
import { MaterialModule } from '../material/material.module';

import { AppRoutingModule } from '../app-routing.module';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { FormtabComponent } from './formtab/formtab.component';
import { PreviewComponent } from './preview/preview.component';
import { DataComponent } from './data/data.component';
import { DialogAlertComponent } from './dialog/alert/dialog-alert.component';
import { DialogModuloComponent } from './dialog/modulo/dialog-modulo.component';
import { DialogSubModuloComponent } from './dialog/submodulo/dialog-submodulo.component';
import { DialogControlComponent } from './dialog/control/dialog-control.component';
import { DialogOptionComponent } from './dialog/option/dialog-option.component';
import { ControlComponent } from './components/control/control.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    FormComponent,
    FormtabComponent,
    PreviewComponent,
    DataComponent,
    DialogAlertComponent,
    DialogModuloComponent,
    DialogSubModuloComponent,
    DialogControlComponent,
    DialogOptionComponent,
    ControlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
  ],
  exports: [
    PagesComponent,
    HomeComponent,
    FormComponent,
    FormtabComponent,
    PreviewComponent,
    DataComponent,
    DialogAlertComponent,
    DialogModuloComponent,
    DialogSubModuloComponent,
    DialogControlComponent,
    DialogOptionComponent,
    ControlComponent
  ]
})
export class PagesModule { }
