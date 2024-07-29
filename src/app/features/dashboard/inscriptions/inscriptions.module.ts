import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InscriptionsRoutingModule } from './inscriptions-routing.module';
import { InscriptionsComponent } from './inscriptions.component';
import { CrudInscriptionsComponent } from './components/crud-inscriptions/crud-inscriptions/crud-inscriptions.component';
import { InscriptionsDialogComponent } from './components/inscriptions-dialog/inscriptions-dialog/inscriptions-dialog.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    InscriptionsComponent,
    CrudInscriptionsComponent,
    InscriptionsDialogComponent
  ],
  exports: [
    InscriptionsComponent
  ],
  imports: [
    CommonModule,
    InscriptionsRoutingModule,
    SharedModule
  ]
})
export class InscriptionsModule { }
