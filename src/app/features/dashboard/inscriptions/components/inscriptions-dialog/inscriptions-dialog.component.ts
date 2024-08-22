import { Component, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../courses/models/course';
import { Inscription } from '../../models/inscription';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from '../../../students/models/student';
import { filter, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCoursesForm, selectStudentsForm } from '../../store/inscription.selectors';
import { InscriptionActions } from '../../store/inscription.actions';
import { beforeStartDateValidator, studentAlreadyEnrolledValidator } from '../../../../../shared/utils/custom.validators';

@Component({
  selector: 'app-inscriptions-dialog',
  templateUrl: './inscriptions-dialog.component.html',
  styleUrl: './inscriptions-dialog.component.scss'
})
export class InscriptionsDialogComponent{
  inscriptionForm: FormGroup;
  students$: Observable<Student[]>;
  courses$: Observable<Course[]>;
  maxDate: Date | null = null;
  selectedCourse?: Course;

  @Input() inscription!: Inscription;
  @Output() onSubmitInscriptionEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<InscriptionsDialogComponent>,
    private store: Store,
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

    this.courses$ = this.store.select(selectCoursesForm);
    this.students$ = this.store.select(selectStudentsForm)
  }

  ngOnInit(): void {
    this.store.dispatch(InscriptionActions.loadCoursesForm());
    this.store.dispatch(InscriptionActions.loadStudentsForm());
  }

  onCourseChange(id: string): void {
    this.courses$.pipe(
      map(courses => courses.find(course => course.id === id)),
      filter(course => !!course),
      take(1)
    ).subscribe(selectedCourse => {
      if (selectedCourse) {
        this.selectedCourse = selectedCourse;
        this.maxDate = new Date(selectedCourse.startDate);
        this.dateControl?.setValidators([Validators.required, beforeStartDateValidator(this.maxDate)]);
        this.studentControl?.setValidators([Validators.required, studentAlreadyEnrolledValidator(this.selectedCourse)]);
      } else {
        this.maxDate = null;
        this.dateControl?.setValidators([Validators.required]);
      }
      this.dateControl?.updateValueAndValidity();
      this.studentControl?.updateValueAndValidity();
    });
  }

  onStudentChange(): void {
    if (this.selectedCourse) {
      this.studentControl?.setValidators([Validators.required, studentAlreadyEnrolledValidator(this.selectedCourse)]);
    } else {
      this.studentControl?.setValidators([Validators.required]);
    }
    this.studentControl?.updateValueAndValidity();
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
    if (this.inscriptionForm.valid) {
      this.matDialogRef.close(this.inscriptionForm.value);
      this.onSubmitInscriptionEvent.emit(this.inscriptionForm.value);
    }
  }
}
