import { TestBed } from '@angular/core/testing';

import { LocalsaveService } from './localsave.service';

describe('LocalsaveService', () => {
  let service: LocalsaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalsaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
