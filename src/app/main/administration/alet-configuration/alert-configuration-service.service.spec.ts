import { TestBed } from '@angular/core/testing';

import { AlertConfigurationServiceService } from './alert-configuration-service.service';

describe('AlertConfigurationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertConfigurationServiceService = TestBed.get(AlertConfigurationServiceService);
    expect(service).toBeTruthy();
  });
});
