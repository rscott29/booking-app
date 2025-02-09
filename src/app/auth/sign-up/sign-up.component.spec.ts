import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../login/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['signUp']);

    await TestBed.configureTestingModule({
      imports: [
        SignUpComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call AuthService.signUp on successful form submission', () => {
    component.signUpForm.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    authServiceMock.signUp.and.returnValue(of(undefined));

    component.signUp();
    expect(authServiceMock.signUp).toHaveBeenCalledWith(
      'John Doe',
      'john.doe@example.com',
      'password123'
    );
  });

  it('should set error message on sign-up failure', () => {
    component.signUpForm.setValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    authServiceMock.signUp.and.returnValue(
      throwError(() => new Error('Sign-up failed'))
    );

    component.signUp();
    expect(component.signUpErrorMessage).toBe(
      'Sign up failed. Please try again.'
    );
  });
});
