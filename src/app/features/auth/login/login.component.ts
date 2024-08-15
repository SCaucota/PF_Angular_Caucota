import { Component, Inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['lucia@gmail.com', [Validators.required, Validators.email]],
      password: ['1234', Validators.required],
    })
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      alert('El formulario noes valido');
    }else {
      const data = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }

      this.authService.login(data)
    }
  }
}
