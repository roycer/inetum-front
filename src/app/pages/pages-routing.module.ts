import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { FormComponent } from './form/form.component';
import { PreviewComponent } from './preview/preview.component';
import { DataComponent } from './data/data.component';

const routes: Routes = [
  {
    path: 'panel',
    component: PagesComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'form/:key', component: FormComponent },
      { path: 'preview/:key', component: PreviewComponent },
      { path: 'data/:key', component: DataComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
