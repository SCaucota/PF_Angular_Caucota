import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TituloDirective } from './directives/titulo.directive';

@NgModule({
  declarations: [
    TituloDirective
  ],
  exports: [
    TituloDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
