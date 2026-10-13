import { TestBed } from '@angular/core/testing';

import { TireManagementService } from './tire-management.service';

describe('TireManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TireManagementService = TestBed.get(TireManagementService);
    expect(service).toBeTruthy();
  });
});
