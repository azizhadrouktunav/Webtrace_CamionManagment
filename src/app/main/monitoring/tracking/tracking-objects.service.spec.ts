import { TestBed } from '@angular/core/testing';

import { TrackingObjectService } from './tracking-objects.service';

describe('TrackingObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackingObjectService = TestBed.get(TrackingObjectService);
    expect(service).toBeTruthy();
  });
});
