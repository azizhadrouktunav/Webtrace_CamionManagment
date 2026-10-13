import { TestBed } from '@angular/core/testing';

import { AlertconfigurationShowedInNotificationService } from './alertconfiguration-showed-in-notification.service';

describe('AlertconfigurationShowedInNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertconfigurationShowedInNotificationService = TestBed.get(AlertconfigurationShowedInNotificationService);
    expect(service).toBeTruthy();
  });
});
