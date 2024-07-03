import { Component, PLATFORM_ID, inject } from '@angular/core';
import { PerformanceTrace } from '@angular/fire/performance';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformServer } from '@angular/common';
import { AuthService } from './auth/login/auth.service';
import { PlatformService } from './shared/services/platform.service';
import { Observable } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { User } from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, MatProgressSpinner],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'booking-app';
  startupTrace: PerformanceTrace | undefined;
  credentials$: Observable<User | null> | undefined;
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  constructor(
    private authService: AuthService,
    private platformService: PlatformService,
    private router: Router
  ) {
    const platformId = inject(PLATFORM_ID);

    if (platformService.isBrowser()) {
      authService
        .getAuthState()
        .pipe(takeUntilDestroyed())
        .subscribe((isLoggedIn) => {
          if (isLoggedIn) {
            //this.router.navigate(['/home']);
          } else if (isLoggedIn === false) {
            this.router.navigate(['/login']);
          }
        });
    }

    if (isPlatformServer(platformId)) {
      return;
    }
  }
}
