import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { PlatformService } from '../../shared/services/platform.service';
import { MessagingService } from '../../shared/services/messaging.service';
import { AppStore } from '../../app.store';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';

describe('AuthService', () => {
  let service: AuthService;
  let authMock: any;
  let routerMock: any;
  let platformServiceMock: any;
  let messagingServiceMock: any;
  let appStoreMock: any;

  beforeEach(() => {
    // Mock implementations
    authMock = {
      onAuthStateChanged: jasmine.createSpy().and.callFake((callback) => callback({ uid: 'testUser' })),
      signInWithPopup: jasmine.createSpy().and.returnValue(Promise.resolve({ user: { uid: 'testUser' }})),
      signOut: jasmine.createSpy().and.returnValue(Promise.resolve()),
      currentUser: { uid: 'testUser' }
    };

    routerMock = { navigate: jasmine.createSpy() };
    platformServiceMock = { isBrowser: jasmine.createSpy().and.returnValue(true) };
    messagingServiceMock = { requestPermission: jasmine.createSpy() };
    appStoreMock = { setCurrentUser: jasmine.createSpy(), clearUser: jasmine.createSpy() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
         provideFirebaseApp(() => initializeApp(firebaseConfig)),
         provideAuth(() => getAuth())  ,
        { provide: Router, useValue: routerMock }, // Mock Router
        { provide: PlatformService, useValue: platformServiceMock }, // Mock PlatformService
        { provide: MessagingService, useValue: messagingServiceMock }, // Mock MessagingService
        { provide: AppStore, useValue: appStoreMock }, // Mock AppStore
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should sign in with Google and navigate to home', async () => {
  //   await service.signInWithGoogle();

  //   expect(authMock.signInWithPopup).toHaveBeenCalled();
  //   expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  //   expect(messagingServiceMock.requestPermission).toHaveBeenCalledWith('testUser');
  //   expect(appStoreMock.setCurrentUser).toHaveBeenCalledWith({ uid: 'testUser' });
  // });


});
