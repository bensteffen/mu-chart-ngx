import { TestBed } from '@angular/core/testing';

import { ScaleStoreService } from './scale-store.service';

describe('ScaleStoreService', () => {
  let service: ScaleStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScaleStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
