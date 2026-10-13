import { TestBed } from '@angular/core/testing';

import { DatacService } from './datac.service';

describe('DatacService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatacService = TestBed.get(DatacService);
    expect(service).toBeTruthy();
  });
});
