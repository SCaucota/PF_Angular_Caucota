import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { SharedModule } from '../../../shared/shared.module';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';



@NgModule({
  declarations: [
    UsersComponent,
    CrudUsersComponent,
    UsersDialogComponent
  ],
  exports:[
    UsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
