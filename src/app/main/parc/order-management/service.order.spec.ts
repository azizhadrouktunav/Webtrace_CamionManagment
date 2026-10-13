import { TestBed } from '@angular/core/testing';

import { OrderService } from './service.order';

describe('Service.OrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderService = TestBed.get(OrderService);
    expect(service).toBeTruthy();
  });
});
