import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationActionsComponent } from './notification-actions.component';
import { NotificationStore } from '../state/notification.store';
import { MatButtonModule } from '@angular/material/button';
import { NotificationAction, NotificationActions } from './enums/notification-actions.enum';
import { NotificationMessage } from '../state/notification.store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NotificationActionsComponent', () => {
  let component: NotificationActionsComponent;
  let fixture: ComponentFixture<NotificationActionsComponent>;
  let notificationStoreMock: any;
  let onActionClickSpy: jasmine.Spy;

  beforeEach(() => {
    // Mock NotificationStore
    notificationStoreMock = jasmine.createSpyObj('NotificationStore', ['yourMethodHere']); // Add necessary methods

    TestBed.configureTestingModule({
      imports: [NotificationActionsComponent, MatButtonModule], // Import the standalone component here
      providers: [
        { provide: NotificationStore, useValue: notificationStoreMock },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore Angular Material components in this test
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationActionsComponent);
    component = fixture.componentInstance;

    // Spy on the output event
    onActionClickSpy = spyOn(component.onActionClick, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should emit action click when emitActionClick is called', () => {
  //   const action: NotificationAction = NotificationActions.Accept; // Use a valid action
  //   component.emitActionClick(action);

  //   expect(onActionClickSpy).toHaveBeenCalledWith(action);
  // });

  // it('should set notification input correctly', () => {
  //   const mockNotification: NotificationMessage = {
  //     id: '1',
  //     message: 'Test notification',
  //     type: NotificationTypes.Info, // Adjust based on your enum
  //     // Include other required properties
  //   };

  //   component.notification = mockNotification;
  //   fixture.detectChanges(); // Trigger change detection

  //   expect(component.notification).toEqual(mockNotification);
  // });

  // Additional tests for button clicks or other interactions can be added here
});
