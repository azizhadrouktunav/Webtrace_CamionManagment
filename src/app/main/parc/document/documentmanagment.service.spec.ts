import { TestBed } from '@angular/core/testing';

import { DocumentmanagmentService } from './documentmanagment.service';

describe('DocumentmanagmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentmanagmentService = TestBed.get(DocumentmanagmentService);
    expect(service).toBeTruthy();
  });
});
