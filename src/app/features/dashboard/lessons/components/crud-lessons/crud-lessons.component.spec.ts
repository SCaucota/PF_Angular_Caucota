import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudLessonsComponent } from './crud-lessons.component';

describe('CrudLessonsComponent', () => {
  let component: CrudLessonsComponent;
  let fixture: ComponentFixture<CrudLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudLessonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
