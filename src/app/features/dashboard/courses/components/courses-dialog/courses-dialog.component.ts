import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../models/course';
import { Time } from '../../models/time';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { noLeadingSpacesValidator, noOnlySpacesValidator } from '../../../../../shared/utils/custom.validators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTimesForm } from '../../store/course.selectors';
import { CourseActions } from '../../store/course.actions';

@Component({
  selector: 'app-courses-dialog',
  templateUrl: './courses-dialog.component.html',
  styleUrl: './courses-dialog.component.scss'
})
export class CoursesDialogComponent implements OnInit{
  courseForm: FormGroup;

  times$: Observable<Time[]>;

  @Input() course!: Course;
  @Output() onSubmitCourseEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<CoursesDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public editingCourse?: Course
  ){
    this.courseForm = this.fb.group({
      name: ['', 
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            noOnlySpacesValidator,
            noLeadingSpacesValidator
          ]
        }
      ],
      description: ['', 
        {
          validators: [
            Validators.required,
            Validators.maxLength(50),
            noOnlySpacesValidator,
            noLeadingSpacesValidator
          ]
        }
      ],
      startDate: ['',  Validators.required],
      endDate: ['',  Validators.required],
      time: ['',  Validators.required],
    })

    if(this.editingCourse){
      this.courseForm.patchValue(this.editingCourse);
    }

    this.times$ = this.store.select(selectTimesForm);
  }

  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadTimesForm());
  }


  get nameControl() {
    return this.courseForm.get("name")
  }

  get nameControlInvalid() {
    return(
      this.nameControl?.invalid &&
      (this.nameControl?.touched ||
      this.nameControl?.dirty)
    )
  }
  
  get descriptionControl() {
    return this.courseForm.get("description")
  }

  get descriptionControlInvalid() {
    return(
      this.descriptionControl?.invalid &&
      (this.descriptionControl?.touched ||
      this.descriptionControl?.dirty)
    )
  }

  get startDateControl() {
    return this.courseForm.get("startDate")
  }

  get startDateControlInvalid() {
    return(
      this.startDateControl?.invalid &&
      (this.startDateControl?.touched ||
      this.startDateControl?.dirty)
    )
  }

  get endDateControl() {
    return this.courseForm.get("endDate")
  }

  get endDateControlInvalid() {
    return(
      this.endDateControl?.invalid &&
      (this.endDateControl?.touched ||
      this.endDateControl?.dirty)
    )
  }

  get timeControl() {
    return this.courseForm.get("time")
  }

  get timeControlInvalid() {
    return(
      this.timeControl?.invalid &&
      (this.timeControl?.touched ||
      this.timeControl?.dirty)
    )
  }

  onSubmitCourse(): void {
    this.matDialogRef.close(this.courseForm.value);
    this.onSubmitCourseEvent.emit(this.courseForm.value)
  }

}
