import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/login/auth.service';
import { MessagingService } from './shared/services/messaging.service';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from './app.config';
import { AppStore } from './app.store';
import { NotificationStore } from './shared/components/ui/notifications/state/notification.store';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth( () => getAuth()),
        provideDatabase( () => getDatabase()),
        provideFunctions( () => getFunctions()),
        AppStore,
        NotificationStore,
        AuthService,
        MessagingService
        ],
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });


});
