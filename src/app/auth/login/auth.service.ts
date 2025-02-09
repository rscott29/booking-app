  import { Injectable, inject } from '@angular/core';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from '@angular/fire/auth';

import {
  Observable,
  ReplaySubject,
  from,
  switchMap,
} from 'rxjs';
import { PlatformService } from '../../shared/services/platform.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessagingService } from '../../shared/services/messaging.service';
import { AppStore } from '../../app.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private platformService = inject(PlatformService);
  private _rememberDevice: boolean = false;
  private authStateSubject = new ReplaySubject<boolean | null>(1);
  private messagingService = inject(MessagingService)
  private appStore = inject(AppStore)

  constructor(private router: Router) {
    authState(this.auth).pipe(takeUntilDestroyed()).subscribe((user: User | null) => {
      this.authStateSubject.next(!!user); // This will convert `User | null` to a boolean
    });
  }

  getAuthState(): Observable<boolean | null> {
    return this.authStateSubject.asObservable();
  }
  public signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const userCredential =  signInWithPopup(this.auth, provider);
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/home']);
        this.messagingService.requestPermission(user.uid);
        //TODO: update to set user global app state instead
        this.appStore.setCurrentUser(user)

      } else {
        this.appStore.clearUser();
      }
    });
    return userCredential;
  }

  public async signInWithFaceBook(): Promise<UserCredential> {
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/home']);
        this.messagingService.requestPermission(user.uid);

        //TODO: update to set user global app state instead

      }
    });

    return userCredential;
  }

  public async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/home']);
        this.messagingService.requestPermission(user.uid);
        localStorage.setItem('user', user.uid)
      }
    });
    return userCredential;
  }

  public signUp(name: string, email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(() => {
        if (this.auth.currentUser) {
          return from(
            updateProfile(this.auth.currentUser, {
              displayName: name,
            })
          );
        } else {
          throw new Error('No current user after sign up');
        }
      })
    );
  }

  public logout(): Promise<void> {
    if (this.platformService.isBrowser()) {
      localStorage.removeItem('remember_me');
      this.router.navigate(['/login']);
    }
    return signOut(this.auth);
  }

  public resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  set rememberDevice(value: boolean) {
    this._rememberDevice = value;
  }

  get rememberDevice(): boolean {
    return this._rememberDevice;
  }
}
