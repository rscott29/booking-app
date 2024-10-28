import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { NotificationStore } from './shared/components/ui/notifications/state/notification.store';
import { AppStore } from './app.store';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp({
        projectId: 'booking-app-71ee7',
        appId: '1:137744105738:web:672e10930e2d66b3bfbaf3',
        storageBucket: 'booking-app-71ee7.appspot.com',
        apiKey: 'AIzaSyDKKKq2aGrcP9MwnJbMX9Rw-JguZ5ZqOQo',
        authDomain: 'booking-app-71ee7.firebaseapp.com',
        messagingSenderId: '137744105738',
        measurementId: 'G-XBT7T9R8BT',
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideRouter(routes), provideAnimationsAsync()
    // provideAppCheck(() => {
    //   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
    //   const provider = new ReCaptchaEnterpriseProvider(
    //     '6LcM-OwpAAAAADcj5P86y8QroK8l9qmt_qhye5cl'
    //   );
    //   return initializeAppCheck(undefined, {
    //     provider,
    //     isTokenAutoRefreshEnabled: true,
    //   });
    // }),
    ,
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging())
    // providePerformance(() => getPerformance()),
    // provideStorage(() => getStorage()),
    // provideRemoteConfig(() => getRemoteConfig()),
    // provideVertexAI(() => getVertexAI()),
    ,
    AppStore,
    NotificationStore,

],
};
