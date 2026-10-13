import { TestBed } from '@angular/core/testing';

import { MobiletankService } from './mobiletank.service';

describe('MobiletankService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MobiletankService = TestBed.get(MobiletankService);
    expect(service).toBeTruthy();
  });
});
