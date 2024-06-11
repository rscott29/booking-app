import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public loginErrorMessage: string = '';
  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberDevice: [false],
    });
    this.rememberDevice?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        localStorage.setItem('remember_me', value);
      });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberDevice() {
    return this.loginForm.get('rememberDevice');
  }

  login() {
    this.loginErrorMessage = '';
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.signInWithEmailAndPassword(
      this.username?.value,
      this.password?.value
    );
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle();

  }

  loginWithFacebook() {
    this.authService.signInWithFaceBook();
  }



  logout() {
    this.authService.logout();
  }

  resetPassword(email: string) {
    this.authService.resetPassword(email);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
