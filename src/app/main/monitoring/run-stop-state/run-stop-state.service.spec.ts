import { TestBed } from '@angular/core/testing';

import { RunStopStateService } from './run-stop-state.service';

describe('RunStopStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RunStopStateService = TestBed.get(RunStopStateService);
    expect(service).toBeTruthy();
  });
});
