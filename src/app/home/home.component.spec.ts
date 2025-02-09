import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { firebaseConfig } from '../app.config';
import { AppStore } from '../app.store';
import { NotificationStore } from '../shared/components/ui/notifications/state/notification.store';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {



    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      declarations: [],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideDatabase( () => getDatabase()),
        provideFirestore(() => getFirestore()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'home', component: HomeComponent }]),
        AppStore,
        NotificationStore

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

      httpTesting = TestBed.inject(HttpTestingController);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




});

