import { TestBed } from '@angular/core/testing';

import { NotificationActionsService } from './notification-actions.service';

describe('NotificationActionsService', () => {
  let service: NotificationActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
