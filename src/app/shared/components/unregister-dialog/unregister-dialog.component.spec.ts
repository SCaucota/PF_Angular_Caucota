import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisterDialogComponent } from './unregister-dialog.component';

describe('UnregisterDialogComponent', () => {
  let component: UnregisterDialogComponent;
  let fixture: ComponentFixture<UnregisterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnregisterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnregisterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
