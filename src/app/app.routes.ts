import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { authGuard } from './auth/auth.guard';
import { GenericOverlayComponent } from './shared/components/generic-overlay/generic-overlay.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  
  },

  {
    path: 'foo',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'test',
        component: GenericOverlayComponent
      },
    ]
  },
  {
    path: 'bar',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'signup', component: SignUpComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
