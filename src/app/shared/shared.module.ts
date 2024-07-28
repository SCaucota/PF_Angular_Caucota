import { ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullnamePipe } from './pipes/fullname.pipe';
import { TitleDirective } from './directives/title.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    FullnamePipe,
    TitleDirective
  ],
  exports: [
    TitleDirective,
    FullnamePipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
