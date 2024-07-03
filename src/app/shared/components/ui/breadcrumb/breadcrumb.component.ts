import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouteService } from '../../../services/route.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  currentRoute$: Observable<string[] | null> | undefined

  constructor(private routeService: RouteService) {
    this.currentRoute$ = this.routeService.currentRoute$.pipe(
      map(route => route ? route.split(' ') : null)
    );
   
  }

  generateRouteLink(index: number, sections: string[]): string {
    return '/' + sections.slice(0, index + 1).join('/');
  }

}
