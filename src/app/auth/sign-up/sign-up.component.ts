import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../login/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormField,
    MatInputModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  signUpForm: FormGroup;
  signUpErrorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get name() {
    return this.signUpForm.get('name');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }

  loginWithFacebook() {
    throw new Error('Method not implemented.');
  }
  loginWithGoogle() {
    throw new Error('Method not implemented.');
  }
  signUp() {
    if (this.signUpForm.invalid) {
      return;
    }

    const { name, email, password } = this.signUpForm.value;

    this.authService.signUp(name, email, password).subscribe({
      next: () => {
        this.router.navigate(['home']);
      },
      error: (error) => {
        console.error('Error during sign-up:', error);
        this.signUpErrorMessage = 'Sign up failed. Please try again.';
      },
    });
  }
}
