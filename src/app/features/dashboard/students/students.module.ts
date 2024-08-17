import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { SharedModule } from '../../../shared/shared.module';
import { StudentsDialogComponent } from './components/students-dialog/students-dialog.component';
import { CrudStudentsComponent } from './components/crud-students/crud-students.component';
import { EffectsModule } from '@ngrx/effects';
import { StudentEffects } from './store/student.effects';


@NgModule({
  declarations: [StudentsComponent, StudentsDialogComponent, CrudStudentsComponent],
  exports: [
    StudentsComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
    EffectsModule.forFeature([StudentEffects]),
  ]
})
export class StudentsModule { }
