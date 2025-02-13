import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { RouteService } from '../../../services/route.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {

    const activatedRouteMock = {
      params: of({}),
      snapshot: { data: {} },
    };

    await TestBed.configureTestingModule({
      imports: [SearchComponent, NoopAnimationsModule],
      providers: [
        RouteService,
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
