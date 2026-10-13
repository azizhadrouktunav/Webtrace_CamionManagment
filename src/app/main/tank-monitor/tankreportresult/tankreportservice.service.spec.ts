import { TestBed } from '@angular/core/testing';

import { TankreportserviceService } from './tankreportservice.service';

describe('TankreportserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TankreportserviceService = TestBed.get(TankreportserviceService);
    expect(service).toBeTruthy();
  });
});
