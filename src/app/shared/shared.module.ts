import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TituloDirective } from './directives/titulo.directive';
import { NombreCompletoPipe } from './Pipes/nombre-completo.pipe';

@NgModule({
  declarations: [
    TituloDirective,
    NombreCompletoPipe,
  ],
  exports: [
    TituloDirective,
    NombreCompletoPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
