import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { SharedModule } from '../../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentsDialogComponent } from './components/students-dialog/students-dialog.component';
import { CrudStudentsComponent } from './components/crud-students/crud-students.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { ListStudentsComponent } from './components/list-students/list-students.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [StudentsComponent, StudentsDialogComponent, CrudStudentsComponent, DeleteDialogComponent, ListStudentsComponent],
  exports: [
    StudentsComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTableModule
  ]
})
export class StudentsModule { }
