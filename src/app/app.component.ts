import { ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { PerformanceTrace } from '@angular/fire/performance';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import { AuthService } from './auth/login/auth.service';
import { PlatformService } from './shared/services/platform.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Auth, user, User } from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Functions } from '@angular/fire/functions';
import { MessagingService } from './shared/services/messaging.service';
import { userInfo } from 'os';
import { getDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [MessagingService],
  imports: [RouterLink, RouterOutlet, CommonModule, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit {
  title = 'booking-app';
  startupTrace: PerformanceTrace | undefined;
  credentials$: Observable<User | null> | undefined;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  functions = inject(Functions);
  afAuth = inject(Auth);
  messageService = inject(MessagingService);
  platformId = inject(PLATFORM_ID);
  db = getDatabase();
  destroyed$ = new Subject<void>()
  constructor(
    private authService: AuthService,
    private platformService: PlatformService,
    private router: Router,
    private messagingService: MessagingService,
  ) {
    if (platformService.isBrowser()) {
      authService
        .getAuthState()
        .pipe(takeUntilDestroyed())
        .subscribe((isLoggedIn) => {
          if (isLoggedIn) {
            this.router.navigate(['/home']);
          } else if (isLoggedIn === false) {
            this.router.navigate(['/login']);
          }
        }); 
    }

    if (isPlatformServer(this.platformId)) {
      return;
    }
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if ('serviceWorker' in navigator) {
    const currentUserId = this.afAuth.currentUser?.uid as string;
            console.log(currentUserId)
        navigator.serviceWorker
          .register('firebase-messaging-sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed: ', error);
          });
      } else {
        console.error('Service Worker API is not supported in this browser.');
      }
    }
}
  showNotification(title: string, body: string) {
    if (!("Notification" in window)) {
      console.error("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
      new Notification(title, { body: 'im a FOREGROUND' + body, icon: '/firebase-logo.png' });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: 'im a FOREGROUND' + body, icon: '/firebase-logo.png' });
        }
      });
    }
  }
}
