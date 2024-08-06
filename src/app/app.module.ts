import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import esAR from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { CoreModule } from './core/core.module';
registerLocaleData(esAR);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-AR'},
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
