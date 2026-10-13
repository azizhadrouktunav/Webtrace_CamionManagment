import { TestBed } from '@angular/core/testing';

import { AccidentdetailsService } from './accidentdetails.service';

describe('AccidentdetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccidentdetailsService = TestBed.get(AccidentdetailsService);
    expect(service).toBeTruthy();
  });
});
