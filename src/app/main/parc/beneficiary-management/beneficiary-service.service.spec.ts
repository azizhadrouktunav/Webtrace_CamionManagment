import { TestBed } from '@angular/core/testing';

import { BeneficiaryService } from './beneficiary.service';

describe('BeneficiaryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeneficiaryService = TestBed.get(BeneficiaryService);
    expect(service).toBeTruthy();
  });
});
