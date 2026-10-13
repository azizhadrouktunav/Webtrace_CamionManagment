import { TestBed } from '@angular/core/testing';

import { GetionChauffeursService } from './getion-chauffeurs.service';

describe('GetionChauffeursService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetionChauffeursService = TestBed.get(GetionChauffeursService);
    expect(service).toBeTruthy();
  });
});
