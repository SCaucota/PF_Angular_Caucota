import { TestBed } from '@angular/core/testing';

import { LessonsService } from './lessons.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LessonsService', () => {
  let service: LessonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LessonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
