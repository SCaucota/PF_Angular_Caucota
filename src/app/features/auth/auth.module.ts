import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../shared/shared.module';
import { APP_CONFIG } from '../../core/injection-tokens/token';
import { AuthService } from '../../core/services/auth/auth.service';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        baseURL: '...',
        version: '2.0'
      }
    }
  ]
})
export class AuthModule { }
