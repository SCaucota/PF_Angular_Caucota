import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lesson } from '../../models/lesson';
import { Course } from '../../../courses/models/course';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { noLeadingSpacesValidator, noOnlySpacesValidator, dateRangeValidator } from '../../../../../shared/utils/custom.validators';
import { Store } from '@ngrx/store';
import { filter, map, Observable, take } from 'rxjs';
import { selectSingleCourse } from '../../../courses/store/course.selectors';
import { selectCoursesForm } from '../../store/lesson.selectors';
import { LessonActions } from '../../store/lesson.actions';

@Component({
  selector: 'app-lessons-dialog',
  templateUrl: './lessons-dialog.component.html',
  styleUrl: './lessons-dialog.component.scss'
})
export class LessonsDialogComponent implements OnInit{
  lessonForm: FormGroup;
  minDate: Date | null = null;
  maxDate: Date | null = null;
  courses$: Observable<Course[]>;
  singleCourse$: Observable<Course>;

  @Input() lesson!: Lesson;
  @Output() onSubmitLessonEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<LessonsDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public editingLesson?: Lesson
  ) {
    this.lessonForm = this.fb.group({
      name: ['',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            noOnlySpacesValidator,
            noLeadingSpacesValidator
          ]
        }
      ],
      date: ['', Validators.required],
      courseTitle: ['', Validators.required],
      status: [true, Validators.required]
    })

    if(this.editingLesson){
      this.lessonForm.patchValue(this.editingLesson);
    }

    this.courses$ = this.store.select(selectCoursesForm);
    this.singleCourse$ = this.store.select(selectSingleCourse)
  }

  ngOnInit(): void {
    this.store.dispatch(LessonActions.loadCoursesForm());
  }

  onCourseTitleChange(courseTitle: string): void {
    this.courses$.pipe(
      map(courses => courses.find(course => course.name === courseTitle)),
      filter(course => !!course),
      take(1)
    ).subscribe(selectedCourse => {
      if (selectedCourse) {
        this.minDate = new Date(selectedCourse.startDate);
        this.maxDate = new Date(selectedCourse.endDate);
        this.dateControl?.setValidators([Validators.required, dateRangeValidator(this.minDate, this.maxDate)]);
      } else {
        this.minDate = null;
        this.maxDate = null;
        this.dateControl?.setValidators([Validators.required]);
      }
      this.dateControl?.updateValueAndValidity();
    })
  }

  get nameControl() {
    return this.lessonForm.get("name")
  }

  get nameControlInvalid() {
    return(
      this.nameControl?.invalid &&
      (this.nameControl?.touched ||
      this.nameControl?.dirty)
    )
  }

  get dateControl() {
    return this.lessonForm.get("date")
  }

  get dateControlInvalid() {
    return(
      this.dateControl?.invalid &&
      (this.dateControl?.touched ||
      this.dateControl?.dirty)
    )
  }

  get coursesTitleControl() {
    return this.lessonForm.get("courseTitle")
  }

  get coursesTitleControlInvalid() {
    return(
      this.coursesTitleControl?.invalid &&
      (this.coursesTitleControl?.touched ||
      this.coursesTitleControl?.dirty)
    )
  }

  get statusControl() {
    return this.lessonForm.get("status")
  }

  get statusControlInvalid() {
    return(
      this.statusControl?.invalid &&
      (this.statusControl?.touched ||
      this.statusControl?.dirty)
    )
  }

  onSubmitLesson(): void {
    this.matDialogRef.close(this.lessonForm.value);
    this.onSubmitLessonEvent.emit(this.lessonForm.value);
  }
}
