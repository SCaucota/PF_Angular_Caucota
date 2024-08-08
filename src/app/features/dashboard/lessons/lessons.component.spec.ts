import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsComponent } from './lessons.component';
import { CrudLessonsComponent } from './components/crud-lessons/crud-lessons.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LessonsService } from '../../../core/services/lessons/lessons.service';
import { SharedModule } from '../../../shared/shared.module';

describe('LessonsComponent', () => {
  let component: LessonsComponent;
  let fixture: ComponentFixture<LessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonsComponent, CrudLessonsComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [
        LessonsService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
