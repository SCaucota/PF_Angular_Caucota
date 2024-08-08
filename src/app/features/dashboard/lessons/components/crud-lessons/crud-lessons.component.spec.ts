import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudLessonsComponent } from './crud-lessons.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LessonsService } from '../../../../../core/services/lessons/lessons.service';
import { SharedModule } from '../../../../../shared/shared.module';

describe('CrudLessonsComponent', () => {
  let component: CrudLessonsComponent;
  let fixture: ComponentFixture<CrudLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudLessonsComponent],
      imports: [HttpClientTestingModule, SharedModule],
      providers: [LessonsService]
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
