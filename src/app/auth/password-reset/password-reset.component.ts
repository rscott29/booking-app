import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  email = new FormControl('');

  constructor(private authService: AuthService) {}
  resetPassword(event: Event) {
    event.preventDefault();
    const emailValue = this.email.value;
    if (emailValue) {
      this.authService.resetPassword(emailValue);
    }
  }
}
