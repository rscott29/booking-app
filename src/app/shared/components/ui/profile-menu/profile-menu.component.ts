import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from '../../../../auth/login/auth.service';
import { OverlayService } from '../../overlay.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-profile-menu',
    imports: [MatIconModule, MatButtonModule, NgScrollbarModule],
    templateUrl: './profile-menu.component.html',
    styleUrl: './profile-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileMenuComponent implements OnInit {
  @Input() data: any;

  constructor(
    private overlayService: OverlayService,
    public auth: Auth,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
   
  }

  close() {
    this.overlayService.close();
  }
  logout() {
    this.overlayService.close();
    this.authService.logout();
  }
}
