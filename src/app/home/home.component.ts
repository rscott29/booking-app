import { ChangeDetectionStrategy, Component, ViewContainerRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/login/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule} from '@angular/material/badge'
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '@angular/fire/auth';
import { OverlayService } from '../shared/components/overlay.service';
import { OverlayConfigModel } from '../shared/components/generic-overlay/model/overlay-config-model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import parsePhoneNumber from 'libphonenumber-js';
import { Observable, debounceTime } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileMenuComponent } from '../shared/components/ui/profile-menu/profile-menu.component';
import { MessagesComponent } from '../shared/components/ui/messages/messages.component';
import { NotificationsComponent } from '../shared/components/ui/notifications/notifications.component';
import { BreadcrumbComponent } from '../shared/components/ui/breadcrumb/breadcrumb.component';
import { SearchComponent } from '../shared/components/ui/search/search.component';
import { RouteService } from '../shared/services/route.service';
import { UsersService } from '../shared/services/users.service';
import { MessagingService } from '../shared/services/messaging.service';
import { get, getDatabase, ref } from '@angular/fire/database';
import { NotificationStore } from '../shared/components/ui/notifications/state/notification.store';

export interface MenuItems {
  name: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    CommonModule,
    NgOptimizedImage,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatBadgeModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    RouterLink,
    RouterLinkActive,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  showFiller = false;
  myForm: FormGroup;
  formattedNumber: string = '';
  menuItems: MenuItems[] = inject(RouteService).getAllRoutes();
  
  users$: Observable<any[]> | undefined;
  notificationStore = inject(NotificationStore)
  constructor(
    private authService: AuthService,
    public auth: Auth,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private readonly firestore: Firestore,
    private usersService: UsersService,
    private messagingService: MessagingService
  ) {
    this.myForm = this.fb.group({
      number: ['', [Validators.required]],
      body: ['', Validators.required],
    });

    this.myForm
      .get('number')!
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((value) => {
        this.formattedNumber = value;
        this.onInput();
      });

    this.users$ = this.usersService.getAllUsers();
  }
  logout() {
    this.authService.logout();
  }

  openProfileOverlay() {
    const config: OverlayConfigModel = {
      position: { top: '59px', right: '16px' },
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    };
    this.overlayService.open(
      ProfileMenuComponent,
      this.viewContainerRef,
      {
        title: 'User Profile',
      },
      config
    );
  }
  openMessagesOverlay() {
    const config: OverlayConfigModel = {
      position: { top: '59px', right: '52px' },
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      width: '360px',
    };
    this.overlayService.open(
      MessagesComponent,
      this.viewContainerRef,
      {
        title: 'Messages',
      },
      config
    );
  }
  openNotificationsOverlay() {
    const config: OverlayConfigModel = {
      position: { top: '59px', right: '52px' },
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      width: '360px',
    };
    this.overlayService.open(
      NotificationsComponent,
      this.viewContainerRef,
      {
        title: 'Notifications',
      },
      config
    );
  }

  openSearchOverlay() {
    const config: OverlayConfigModel = {
      hasBackdrop: true,
      width: '600px',
      showTitle: false,
    };
    this.overlayService.open(
      SearchComponent,
      this.viewContainerRef,
      {
        title: 'Search',
      },
      config
    );
  }

  onInput() {
    const parsedNumber = parsePhoneNumber(this.formattedNumber, 'GB');
    if (parsedNumber) {
      this.formattedNumber = parsedNumber.number.toString();
      this.myForm
        .get('number')!
        .setValue(this.formattedNumber, { emitEvent: false });
    }
  }

  sendFriendRequest(friendId: string) {
   
    this.messagingService.sendFriendRequest(friendId)
  }
  
  async onSubmit() {
    if (this.myForm.valid) {
      return await addDoc(collection(this.firestore, 'messages'), {
        to: this.myForm.value.number,
        body: this.myForm.value.body,
      });
    } else {
      throw new Error('failed to send message');
    }
  }
}
