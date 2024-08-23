import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AlertsService } from '../../../core/services/sweetalert/alerts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noLeadingSpacesValidator, noOnlySpacesValidator } from '../../../shared/utils/custom.validators';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  hide: boolean = true;
  nameValidatorPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  constructor(
    private store: Store,
    private authService: AuthService,
    private alertsService: AlertsService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
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
      ]
    })
  }

  get nameControl() {
    return this.registerForm.get('name')
  }

  get nameControlInvalid() {
    return (
      this.nameControl?.invalid &&
      (this.nameControl?.touched ||
      this.nameControl?.dirty)
    )
  }

  get surnameControl() {
    return this.registerForm.get('surname')
  }

  get surnameControlInvalid() {
    return (
      this.surnameControl?.invalid &&
      (this.surnameControl?.touched ||
      this.surnameControl?.dirty)
    )
  }

  get emailControl() {
    return this.registerForm.get('email')
  }

  get emailControlInvalid() {
    return (
      this.emailControl?.invalid &&
      (this.emailControl?.touched ||
      this.emailControl?.dirty)
    )
  }

  get passwordControl() {
    return this.registerForm.get('password')
  }

  get passwordControlInvalid() {
    return (
      this.passwordControl?.invalid &&
      (this.passwordControl?.touched ||
      this.passwordControl?.dirty)
    )
  }

  onSubmit() {
    if(this.registerForm.invalid) {
      this.alertsService.sendError('El formulario es inválido')
    }else {
      const data = {
        name: this.registerForm.get('name')?.value,
        surname: this.registerForm.get('surname')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      }

      this.authService.register(data)
    }
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
}
