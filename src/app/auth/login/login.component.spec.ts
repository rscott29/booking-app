import { AppStore } from './../../app.store';
import { NotificationStore } from './../../shared/components/ui/notifications/state/notification.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';
import { MessagingService } from '../../shared/services/messaging.service';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LoginComponent,

      ],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        AuthService,
        MessagingService,
        NotificationStore,
        AppStore,
        provideRouter([{ path: 'login', component: LoginComponent }]),
        ReactiveFormsModule
      ],
    })
    .compileComponents();


    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
