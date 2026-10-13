import { TestBed } from '@angular/core/testing';

import { GestionStockService } from './gestion-stock.service';

describe('GestionStockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionStockService = TestBed.get(GestionStockService);
    expect(service).toBeTruthy();
  });
});
