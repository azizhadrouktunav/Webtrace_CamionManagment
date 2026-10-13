import { TestBed } from '@angular/core/testing';

import { TanksService } from './tanks.service';

describe('TanksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TanksService = TestBed.get(TanksService);
    expect(service).toBeTruthy();
  });
});
