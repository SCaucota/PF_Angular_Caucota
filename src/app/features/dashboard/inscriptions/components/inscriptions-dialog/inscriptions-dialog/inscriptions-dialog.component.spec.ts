import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionsDialogComponent } from './inscriptions-dialog.component';

describe('InscriptionsDialogComponent', () => {
  let component: InscriptionsDialogComponent;
  let fixture: ComponentFixture<InscriptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InscriptionsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
