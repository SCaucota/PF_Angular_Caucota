import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { UsersComponent } from './users.component';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';


@NgModule({
  declarations: [
    UsersComponent,
    UsersDialogComponent,
    CrudUsersComponent
  ],
  exports: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
