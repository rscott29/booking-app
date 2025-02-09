import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileMenuComponent } from './profile-menu.component';
import { OverlayService } from '../../overlay.service';
import { AuthService } from '../../../../auth/login/auth.service';
import { Auth } from '@angular/fire/auth';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileMenuComponent', () => {
  let component: ProfileMenuComponent;
  let fixture: ComponentFixture<ProfileMenuComponent>;
  let overlayServiceMock: jasmine.SpyObj<OverlayService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let authMock: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
  
    overlayServiceMock = jasmine.createSpyObj('OverlayService', ['close']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    authMock = jasmine.createSpyObj('Auth', ['currentUser']); 

    await TestBed.configureTestingModule({
      imports: [ProfileMenuComponent],
      providers: [
        { provide: OverlayService, useValue: overlayServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Auth, useValue: authMock } 
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
   // expect(component).toBeTruthy();
  });



  it('should call overlayService.close() on close()', () => {
    component.close();
    expect(overlayServiceMock.close).toHaveBeenCalled();
  });

  it('should call overlayService.close() and authService.logout() on logout()', () => {
    component.logout();
    expect(overlayServiceMock.close).toHaveBeenCalled();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should set data input correctly', () => {
    const mockData = { name: 'John Doe' }; 
    component.data = mockData;
    expect(component.data).toEqual(mockData);
  });
});
