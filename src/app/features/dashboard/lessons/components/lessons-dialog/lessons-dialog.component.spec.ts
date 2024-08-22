import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonsDialogComponent } from './lessons-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LessonsService } from '../../../../../core/services/lessons/lessons.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { Course } from '../../../courses/models/course';
import { FormBuilder, Validators } from '@angular/forms';
import { noLeadingSpacesValidator, noOnlySpacesValidator } from '../../../../../shared/utils/custom.validators';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LessonActions } from '../../store/lesson.actions';

describe('LessonsDialogComponent', () => {
  let component: LessonsDialogComponent;
  let fixture: ComponentFixture<LessonsDialogComponent>;
  let mockCourses: Course[];
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<LessonsDialogComponent>>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    mockCourses = [
      { id: "sefsxc", name: 'Course 1', startDate: new Date('2024-12-13'), endDate: new Date('2025-02-13'), description: 'testing1', time: '10:00 - 12:00', students: ['2'] },
      { id: "dsssss", name: 'Course 2', startDate: new Date('2024-06-21'), endDate: new Date('2024-11-25'), description: 'testing2', time: '08:00 - 10:00', students: ['3, 2'] }
    ];
    await TestBed.configureTestingModule({
      declarations: [LessonsDialogComponent],
      imports: [
        MatDialogModule,
        SharedModule,
      ],
      providers: [
        LessonsService,
        provideAnimationsAsync(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideMockStore({ initialState: {} })
      ]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(LessonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.lessonForm = TestBed.inject(FormBuilder).group({
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
    component.courses$ = of(mockCourses)
    fixture.detectChanges();

    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('El nombre debe ser requerido', () => {
    const nameControl = component.lessonForm.get('name')
    nameControl?.setValue('');
    expect(nameControl?.invalid).toBeTrue();
  })

  it('Debe cargar los cursos al iniciarse', () => {
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(LessonActions.loadCoursesForm());
  })

  it('Setea la fecha mínima y máxima. Valida la fecha', () => {
    const courseTitle = 'Course 2';
    const selectedCourse = mockCourses.find(course => course.name === courseTitle);

    component.onCourseTitleChange(courseTitle);

    expect(component.minDate).toEqual(new Date(selectedCourse!.startDate));
    expect(component.maxDate).toEqual(new Date(selectedCourse!.endDate));

    const dateControl = component.lessonForm.get('date');
    if (dateControl) {
      const validators = dateControl.validator ? dateControl.validator({} as any) : null;

      expect(validators).toBeTruthy();
    }
  });

  it('Debe resetear la fecha mínima y máxima, y actualizar el dateControl cuando es inválido', () => {
    const courseTitle = 'Curso inválido';

    component.onCourseTitleChange(courseTitle);

    expect(component.minDate).toBeNull();
    expect(component.maxDate).toBeNull();
    const dateControl = component.lessonForm.get('date');
    if (dateControl) {
      const validators = dateControl.validator ? dateControl.validator({} as any) : {}
      expect(validators).toEqual(Validators.required({} as any));
    }
  })

  it('Actualiza el valor del date control y lo valida', () => {
    const dateControl = component.lessonForm.get('date');

    if (dateControl) {
      spyOn(dateControl, 'updateValueAndValidity');

      const courseTitle = 'Course 1';
      component.onCourseTitleChange(courseTitle);

      expect(dateControl.updateValueAndValidity).toHaveBeenCalled();
    }
  })

  it('Cierra el dialog y emite los datos del formulario', () => {
    const formValue = { name: 'Test Lesson', date: new Date('2024-12-15'), courseTitle: 'Course 1', status: true };
    component.lessonForm.setValue(formValue);

    spyOn(component.onSubmitLessonEvent, 'emit');

    component.onSubmitLesson();

    expect(mockDialogRef.close).toHaveBeenCalledWith(formValue);
    expect(component.onSubmitLessonEvent.emit).toHaveBeenCalledWith(formValue)
  })
})
