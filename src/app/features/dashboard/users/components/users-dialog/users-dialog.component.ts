import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { noOnlySpacesValidator, noLeadingSpacesValidator } from '../../../../../shared/utils/custom.validators';
import { User } from '../../models/user';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrl: './users-dialog.component.scss'
})
export class UsersDialogComponent {
  userForm: FormGroup;

  @Input() user!: User
  @Output() onSubmitUserEvent: EventEmitter<any> = new EventEmitter();

  nameValidatorPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editingUser?: User
  ) {
    this.userForm = this.fb.group({
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
          ],
        }
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', 
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            noOnlySpacesValidator,
            noLeadingSpacesValidator
          ],
        }
      ],
      role: ['', Validators.required]
    })

    if(this.editingUser) {
      this.userForm.patchValue(this.editingUser)
    }
  }

  get nameControl() {
    return this.userForm.get('name')
  }

  get nameControlInvalid() {
    return (
      this.nameControl?.invalid &&
      (this.nameControl?.touched ||
      this.nameControl?.dirty)
    )
  }

  get surnameControl() {
    return this.userForm.get('surname')
  }

  get surnameControlInvalid() {
    return (
      this.surnameControl?.invalid &&
      (this.surnameControl?.touched ||
      this.surnameControl?.dirty)
    )
  }

  get emailControl() {
    return this.userForm.get('email')
  }

  get emailControlInvalid() {
    return (
      this.emailControl?.invalid &&
      (this.emailControl?.touched ||
      this.emailControl?.dirty)
    )
  }

  get passwordControl() {
    return this.userForm.get('password')
  }

  get passwordControlInvalid() {
    return (
      this.passwordControl?.invalid &&
      (this.passwordControl?.touched ||
      this.passwordControl?.dirty)
    )
  }

  get roleControl() {
    return this.userForm.get('role')
  }

  get roleControlInvalid() {
    return (
      this.roleControl?.invalid &&
      (this.roleControl?.touched ||
      this.roleControl?.dirty)
    )
  }

  onSubmitUser(): void {
    this.matDialogRef.close(this.userForm.value);
    this.onSubmitUserEvent.emit(this.userForm.value)
  }
  
}
