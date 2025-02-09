import { TestBed } from '@angular/core/testing';
import { MessagingService } from './messaging.service';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { signalStore } from '@ngrx/signals';
import { AppStore } from '../../app.store';
import { NotificationStore } from '../components/ui/notifications/state/notification.store';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';

describe('MessagingService', () => {
  let service: MessagingService;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MessagingService,
         provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideDatabase(() => getDatabase()),
         provideAuth(() => getAuth())  ,
         AppStore,
         NotificationStore

      ],
    });

    service = TestBed.inject(MessagingService);
    store = TestBed.inject(AppStore)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
