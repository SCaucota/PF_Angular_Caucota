import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrl: './abm-alumnos.component.scss'
})
export class AbmAlumnosComponent {

  alumnoForm: FormGroup;
  nombrePattern = /^[a-zA-Z\s]+$/;

  constructor(private formBuilder: FormBuilder, private matDialogRef: MatDialogRef<AbmAlumnosComponent>) {
    this.alumnoForm = this.formBuilder.group({
      nombre: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(this.nombrePattern),
          ]
        }
      ],
      apellido: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(this.nombrePattern)
          ]
        }

      ]
    })
  }

  onSubmit(): void {
    console.log("Funciona la subida de datos")

    this.matDialogRef.close(this.alumnoForm.value)
  }
}
