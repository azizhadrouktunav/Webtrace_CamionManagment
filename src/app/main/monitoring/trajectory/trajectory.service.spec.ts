import { TestBed } from '@angular/core/testing';

import { TrajectoryService } from './trajectory.service';

describe('TrajectoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrajectoryService = TestBed.get(TrajectoryService);
    expect(service).toBeTruthy();
  });
});
