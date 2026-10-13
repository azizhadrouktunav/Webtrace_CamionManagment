import { TestBed } from '@angular/core/testing';

import { PlacesGeometricShapesManagementService } from './places-geometric-shapes-management.service';

describe('PlacesGeometricShapesManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlacesGeometricShapesManagementService = TestBed.get(PlacesGeometricShapesManagementService);
    expect(service).toBeTruthy();
  });
});
