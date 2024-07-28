import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCoursesComponent } from './crud-courses.component';

describe('CrudCoursesComponent', () => {
  let component: CrudCoursesComponent;
  let fixture: ComponentFixture<CrudCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
