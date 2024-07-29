import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lesson } from '../../models/lesson';
import { Course } from '../../../courses/models/course';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoursesService } from '../../../../../core/services/courses/courses.service';
import { noLeadingSpacesValidator, noOnlySpacesValidator, dateRangeValidator } from '../../../../../shared/utils/custom.validators';

@Component({
  selector: 'app-lessons-dialog',
  templateUrl: './lessons-dialog.component.html',
  styleUrl: './lessons-dialog.component.scss'
})
export class LessonsDialogComponent implements OnInit{
  lessonForm: FormGroup;
  courses: Course[] = [];
  minDate: Date | null = null;
  maxDate: Date | null = null;

  @Input() lesson!: Lesson;
  @Output() onSubmitLessonEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<LessonsDialogComponent>,
    private coursesService: CoursesService,
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
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (coursesFomrDb) => {
        this.courses = coursesFomrDb
      }
    })
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  onCourseTitleChange(courseTitle: string): void {
    const selectedCourse = this.courses.find(course => course.name === courseTitle);
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
