import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OverlayService } from '../overlay.service';
import { NG_SCROLLBAR_OPTIONS, NgScrollbarModule } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../../auth/login/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-generic-overlay',
  standalone: true,
  imports: [NgScrollbarModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './generic-overlay.component.html',
  styleUrl: './generic-overlay.component.scss',
})
export class GenericOverlayComponent implements AfterViewInit {
  @ViewChild('templateRef') templateRef: TemplateRef<any> | undefined;
  data: any;

  constructor(
    private overlayService: OverlayService,
    public auth: Auth,
    private authService: AuthService
  ) {}
  ngAfterViewInit(): void {
    console.log(this.auth?.currentUser);
  }
  close() {
    this.overlayService.close();
  }
  logout() {
    this.overlayService.close();
    this.authService.logout();
  }
}
