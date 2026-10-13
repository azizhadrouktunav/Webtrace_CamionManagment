import { TestBed } from '@angular/core/testing';

import { GestionDesVehiculesService } from './gestion-des-vehicules.service';

describe('GestionDesVehiculesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionDesVehiculesService = TestBed.get(GestionDesVehiculesService);
    expect(service).toBeTruthy();
  });
});
