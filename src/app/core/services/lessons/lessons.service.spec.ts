import { TestBed } from '@angular/core/testing';
import { LessonsService } from './lessons.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Lesson } from '../../../features/dashboard/lessons/models/lesson';

describe('LessonsService', () => {
  let service: LessonsService;
  let httpMock: HttpTestingController;
  let mockLessons: Lesson[];
  let mockSingleLesson: Lesson;

  beforeEach(() => {
    mockLessons = [
      {id: 'ds6ef2', name: 'Lesson 1', date: new Date('2024-12-15'), courseTitle: 'Course 1', status: true},
      {id: 'seflk9', name: 'Lesson 2', date: new Date('2024-05-03'), courseTitle: 'Course 2', status: false}
    ]

    mockSingleLesson = {id: 'dsekl', name: 'Lesson 1', date: new Date('2024-02-05'), courseTitle: 'Course 1', status: true}

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LessonsService]
    });
    service = TestBed.inject(LessonsService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Se traen correctamenta todos las clases', () => {
    service.getLessons().subscribe(lessons => {
      expect(lessons.length).toBe(2);
      expect(lessons).toEqual(mockLessons)
    })

    const request = httpMock.expectOne(`${service.URL_BASE}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockLessons);
  })

  it('Se devuelve únicamente una clase', () => {
    const id = 'dsekl';

    service.getLessonById(id).subscribe(lesson => {
      expect(lesson).toEqual(mockSingleLesson)
    })

    const request = httpMock.expectOne(`${service.URL_BASE}/${id}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockSingleLesson)
  })

  it('Agregado existoso de una nueva clase', () => {
    const modifiedLesson = {
      ...mockSingleLesson,
      name: mockSingleLesson.name.toUpperCase(),
      courseTitle: mockSingleLesson.courseTitle.toUpperCase()
    };

    service.addLesson(mockSingleLesson).subscribe(response => {
      expect(response).toBeTruthy();
    })

    const request = httpMock.expectOne(service.URL_BASE);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(modifiedLesson);
    request.flush({success: true});
  })

  it('Elminación existosa de una clase', () => {
    const id = 'dsekl';

    service.deleteLesson(id).subscribe(response => {
      expect(response).toEqual({});
    })

    const request = httpMock.expectOne(`${service.URL_BASE}/${id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({})
  })

  it('Se debe editar una clase existente', () => {
    const id = 'dsekl';

    const updatedLesson: Lesson = { id: id, name: 'Lesson 56', date: new Date('2024-02-03'), courseTitle: 'Course 1', status: false}

    const lessonTestEdit = {
      ...updatedLesson,
      name: updatedLesson.name.toUpperCase(),
      courseTitle: updatedLesson.courseTitle.toUpperCase()
    }

    service.editLesson(id, updatedLesson).subscribe(lesson => {
      expect(lesson).toEqual(updatedLesson);
    })

    const request = httpMock.expectOne(`${service.URL_BASE}/${id}`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(lessonTestEdit);
    request.flush(updatedLesson)
  })
});
