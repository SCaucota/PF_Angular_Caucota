import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsDialogComponent } from './lessons-dialog.component';

describe('LessonsDialogComponent', () => {
  let component: LessonsDialogComponent;
  let fixture: ComponentFixture<LessonsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
