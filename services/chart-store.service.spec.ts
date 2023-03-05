import { TestBed } from '@angular/core/testing';

import { ChartStoreService } from './chart-store.service';

describe('ChartStoreService', () => {
  let service: ChartStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
