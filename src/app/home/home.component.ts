import { Component } from '@angular/core';
import { signOut } from 'firebase/auth';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/login/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public currentUser: string | null | undefined;
  constructor(private authService: AuthService, private router: Router) {
   // this.currentUser = authService.getLoggedInUser()?.displayName
  }
   logout() {
    this.authService.logout()
  }
}
