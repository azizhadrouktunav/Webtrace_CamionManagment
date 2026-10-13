import { TestBed } from '@angular/core/testing';

import { BorrowedRentalService } from './borrowedrental.service';

describe('BorrowedrentalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BorrowedRentalService = TestBed.get(BorrowedRentalService);
    expect(service).toBeTruthy();
  });
});
