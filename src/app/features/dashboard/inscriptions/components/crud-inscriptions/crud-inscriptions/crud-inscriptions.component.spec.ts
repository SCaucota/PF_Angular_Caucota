import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudInscriptionsComponent } from './crud-inscriptions.component';

describe('CrudInscriptionsComponent', () => {
  let component: CrudInscriptionsComponent;
  let fixture: ComponentFixture<CrudInscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudInscriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudInscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
