import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesRoutingModule } from './pages/pages-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/panel', pathMatch: 'full' },
  { path: '**', redirectTo: '/panel', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
