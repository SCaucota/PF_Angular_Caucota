import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../models/student';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { noOnlySpacesValidator, noLeadingSpacesValidator } from '../../../../utils/custom.validators';

@Component({
  selector: 'app-students-dialog',
  templateUrl: './students-dialog.component.html',
  styleUrl: './students-dialog.component.scss'
})
export class StudentsDialogComponent {
  studentForm: FormGroup;

  @Input() student!: Student
  @Output() onSubmitStudentEvent: EventEmitter<any> = new EventEmitter();

  nameValidatorPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<StudentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editingStudent?: Student
  ) {
    this.studentForm = this.fb.group({
      name: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(this.nameValidatorPattern),
            noOnlySpacesValidator,
            noLeadingSpacesValidator
          ],
        }
      ],
      surname: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(this.nameValidatorPattern),
            noOnlySpacesValidator,
            noLeadingSpacesValidator
          ]
        }
      ]
    })

    if(this.editingStudent){
      this.studentForm.patchValue(this.editingStudent)
    }
  }

  get nameControl() {
    return this.studentForm.get('name')
  }

  get nameControlInvalid() {
    return (
      this.nameControl?.invalid &&
      (this.nameControl?.touched ||
      this.nameControl?.dirty)
    )
  }

  get surnameControl() {
    return this.studentForm.get('surname')
  }

  get surnameControlInvalid() {
    return (
      this.surnameControl?.invalid &&
      (this.surnameControl?.touched ||
      this.surnameControl?.dirty)
    )
  }

  onSubmitStudent(): void {
    if(this.studentForm.invalid){
      alert('Formulario invalido')
    }else{
      this.matDialogRef.close(this.studentForm.value);
      this.onSubmitStudentEvent.emit(this.studentForm.value)
    }
  }
}
