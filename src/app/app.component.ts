import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { PerformanceTrace } from '@angular/fire/performance';
import { NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import { AuthService } from './auth/login/auth.service';
import { PlatformService } from './shared/services/platform.service';
import { Observable, Subject } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Auth, User } from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Functions } from '@angular/fire/functions';
import { MessagingService } from './shared/services/messaging.service';
import { getDatabase } from '@angular/fire/database';


@Component({
    selector: 'app-root',
    providers: [MessagingService],
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
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

        navigator.serviceWorker
          .register('firebase-messaging-sw.js')
          .then((registration) => {

            this.messagingService.receiveMessage();

          })
          .catch((error) => {
            console.error('ServiceWorker registration failed: ', error);
          });
          navigator.serviceWorker.addEventListener('message', (event) => {

            if (event.data && event.data.type === 'BACKGROUND_NOTIFICATION') {

              this.messagingService.handleBackgroundMessage(event.data.message);
            }
          });
      } else {
        console.error('Service Worker API is not supported in this browser.');
      }
    }
}

}
