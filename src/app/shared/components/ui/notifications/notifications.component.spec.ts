import { NotificationsComponent } from './notifications.component';
import { NotificationStore } from './state/notification.store';
import { MessagingService } from '../../../services/messaging.service';
import { NotificationActionsService } from './notification-actions/notification-actions.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../../../../app.config';
import { provideAuth, getAuth } from '@angular/fire/auth';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [
        NotificationStore,
        MessagingService,
        NotificationActionsService,
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideDatabase(() => getDatabase()),
        provideAuth(() => getAuth()),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
