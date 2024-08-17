import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { UsersComponent } from './users.component';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { CrudUsersComponent } from './components/crud-users/crud-users.component';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/user.effects';
import { StoreModule } from '@ngrx/store';
import { userFeature } from './store/user.reducer';


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
    SharedModule,
    EffectsModule.forFeature([UserEffects]),
    StoreModule.forFeature(userFeature)
  ]
})
export class UsersModule { }
