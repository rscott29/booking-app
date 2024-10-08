import { Component } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  currentroute$: Observable<string | null> | undefined

  constructor(private routerService: RouteService) {
      this.currentroute$ = routerService.currentRoute$
  }

}
