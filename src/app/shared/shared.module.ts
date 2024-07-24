import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullnamePipe } from './pipes/fullname.pipe';
import { TitleDirective } from './directives/title.directive';

@NgModule({
  declarations: [
    FullnamePipe,
    TitleDirective
  ],
  exports: [
    TitleDirective,
    FullnamePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
