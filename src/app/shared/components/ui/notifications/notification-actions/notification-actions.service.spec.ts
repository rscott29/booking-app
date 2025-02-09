import { TestBed } from '@angular/core/testing';

import { NotificationActionsService } from './notification-actions.service';
import { AppStore } from '../../../../../app.store';
import { OverlayService } from '../../../overlay.service';
import { NotificationStore } from '../state/notification.store';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../../../../../app.config';
import { getDatabase, provideDatabase } from '@angular/fire/database';

describe('NotificationActionsService', () => {
  let service: NotificationActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStore, OverlayService, NotificationStore,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),

      ]
    });
    service = TestBed.inject(NotificationActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
