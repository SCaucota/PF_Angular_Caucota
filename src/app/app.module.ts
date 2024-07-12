import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TituloDirective } from './shared/directives/titulo.directive';
import { NombreCompletoPipe } from './shared/Pipes/nombre-completo.pipe';
import { LayoutModule } from './components/layout/layout.module';

import esAR from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
registerLocaleData(esAR);

@NgModule({
  declarations: [
    AppComponent,
    TituloDirective,
    NombreCompletoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule
],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-AR'},
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
