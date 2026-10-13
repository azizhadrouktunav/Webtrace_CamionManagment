import { TestBed } from '@angular/core/testing';

import { DepensesGeneralService } from './depenses-general.service';

describe('DepensesGeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepensesGeneralService = TestBed.get(DepensesGeneralService);
    expect(service).toBeTruthy();
  });
});
