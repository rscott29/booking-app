import { Component, ViewContainerRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/login/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
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
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import parsePhoneNumber from 'libphonenumber-js';
import { debounceTime } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileMenuComponent } from '../shared/components/ui/profile-menu/profile-menu.component';
import { MessagesComponent } from '../shared/components/ui/messages/messages.component';
import { BreadcrumbComponent } from '../shared/components/breadcrumb/breadcrumb.component';
import { NotificationsComponent } from '../shared/components/ui/notifications/notifications.component';

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
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    RouterLink,
    RouterLinkActive,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showFiller = false;
  myForm: FormGroup;
  formattedNumber: string = '';
  menuItems: MenuItems[] = [
    {
      name: 'Photos',
      icon: 'photo_camera',
      link: '/home',
    },
    {
      name: 'Recipes',
      icon: 'cookie',
      link: '/foo',
    },
    {
      name: 'Work',
      icon: 'group',
      link: '/bar',
    },
  ];
  constructor(
    private authService: AuthService,
    public auth: Auth,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder,
    private readonly firestore: Firestore
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

  onInput() {
    const parsedNumber = parsePhoneNumber(this.formattedNumber, 'GB');
    if (parsedNumber) {
      this.formattedNumber = parsedNumber.number.toString();
      this.myForm
        .get('number')!
        .setValue(this.formattedNumber, { emitEvent: false });
    }
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
