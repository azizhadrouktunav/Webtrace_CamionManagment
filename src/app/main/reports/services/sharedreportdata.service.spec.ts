import { TestBed } from '@angular/core/testing';

import { SharedreportdataService } from './sharedreportdata.service';

describe('SharedreportdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedreportdataService = TestBed.get(SharedreportdataService);
    expect(service).toBeTruthy();
  });
});
