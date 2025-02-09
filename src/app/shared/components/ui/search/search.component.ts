import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouteService } from '../../../services/route.service';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { OverlayService } from '../../overlay.service';

@Component({
    selector: 'app-search',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  inputValue: string = '';
  allRoutes = inject(RouteService).getAllRoutes();
  private inputSubject = new Subject<string>();
  filteredRoutes = this.allRoutes 
  constructor(private cdr: ChangeDetectorRef, private overlayService: OverlayService) {
  }
  ngOnInit(): void {
    this.inputSubject.pipe(debounceTime(100)).subscribe(inputValue => {
      this.filteredRoutes = this.filterRoutes(inputValue);
      this.cdr.detectChanges();
    });
  }
  onInputChange(value: string) {
    this.inputSubject.next(value);
  }
  closeOverlay() {
      this.overlayService.close();
  }
  filterRoutes(searchText: string) {
    if (!searchText) {
      return this.allRoutes;
    }
    searchText = searchText.toLowerCase();
    return this.allRoutes.filter(route =>
      route.name.toLowerCase().includes(searchText) ||
      route.link.toLowerCase().includes(searchText)
    );
  }


}
