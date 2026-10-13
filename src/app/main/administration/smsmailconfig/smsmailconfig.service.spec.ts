import { TestBed } from '@angular/core/testing';

import { SmsmailconfigService } from './smsmailconfig.service';

describe('SmsmailconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmsmailconfigService = TestBed.get(SmsmailconfigService);
    expect(service).toBeTruthy();
  });
});
