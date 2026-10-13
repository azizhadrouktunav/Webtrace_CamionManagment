import { TestBed } from '@angular/core/testing';

import { ConfigurablereportService } from './configurablereport.service';

describe('ConfigurablereportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigurablereportService = TestBed.get(ConfigurablereportService);
    expect(service).toBeTruthy();
  });
});
