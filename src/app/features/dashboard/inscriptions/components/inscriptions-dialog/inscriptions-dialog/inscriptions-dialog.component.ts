import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../../courses/models/course';
import { Inscription } from '../../../models/inscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoursesService } from '../../../../../../core/services/courses/courses.service';
import { StudentsService } from '../../../../../../core/services/students/students.service';
import { Student } from '../../../../students/models/student';

@Component({
  selector: 'app-inscriptions-dialog',
  templateUrl: './inscriptions-dialog.component.html',
  styleUrl: './inscriptions-dialog.component.scss'
})
export class InscriptionsDialogComponent {
  inscriptionForm: FormGroup;
  courses: Course[] = [];
  students: Student[] = [];

  @Input() inscription!: Inscription;
  @Output() onSubmitInscriptionEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<InscriptionsDialogComponent>,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    @Inject(MAT_DIALOG_DATA) public editingInscription?: Inscription
  ) { 
    this.inscriptionForm = this.fb.group({
      studentId: ['', Validators.required],
      courseId: ['', Validators.required],
      date: ['', Validators.required],
      status: [true, Validators.required]
    })
    
    if(this.editingInscription){
      this.inscriptionForm.patchValue(this.editingInscription);
    }
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (coursesFomrDb) => {
        this.courses = coursesFomrDb
      },
      error: (err) => console.log("Error al cargar los cursos en Insciprción: ", err)
    })
    this.studentsService.getStudents().subscribe({
      next: (studentsFormDb) => {
        this.students = studentsFormDb
      },
      error: (err) => console.log("Error al cargar estudiantes en Insciprión: ", err)
    })
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  get studentControl() {
    return this.inscriptionForm.get("studentId")
  }

  get studentControlInvalid() {
    return(
      this.studentControl?.invalid &&
      (this.studentControl?.touched ||
      this.studentControl?.dirty)
    )
  }

  get courseControl() {
    return this.inscriptionForm.get("courseId")
  }

  get courseControlInvalid() {
    return(
      this.courseControl?.invalid &&
      (this.courseControl?.touched ||
      this.courseControl?.dirty)
    )
  }  

  get dateControl() {
    return this.inscriptionForm.get("date")
  }

  get dateControlInvalid() {
    return(
      this.dateControl?.invalid &&
      (this.dateControl?.touched ||
      this.dateControl?.dirty)
    )
  }

  get statusControl() {
    return this.inscriptionForm.get("status")
  }

  get statusControlInvalid() {
    return(
      this.statusControl?.invalid &&
      (this.statusControl?.touched ||
      this.statusControl?.dirty)
    )
  }

  onSubmitInscription(): void {
    this.matDialogRef.close(this.inscriptionForm.value);
    this.onSubmitInscriptionEvent.emit(this.inscriptionForm.value);
  }
}
