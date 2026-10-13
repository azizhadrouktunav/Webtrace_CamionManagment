import { TestBed } from '@angular/core/testing';

import { PompeMonitorService } from './pompe-monitor.service';

describe('PompeMonitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PompeMonitorService = TestBed.get(PompeMonitorService);
    expect(service).toBeTruthy();
  });
});
